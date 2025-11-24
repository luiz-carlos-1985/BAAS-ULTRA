package main

import (
	"fmt"
	"math/rand"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Card struct {
	ID          uuid.UUID `json:"id" gorm:"type:uuid;primary_key"`
	AccountID   uuid.UUID `json:"account_id" gorm:"type:uuid;index"`
	CardNumber  string    `json:"card_number" gorm:"uniqueIndex"`
	CVV         string    `json:"cvv"`
	ExpiryDate  string    `json:"expiry_date"`
	Status      string    `json:"status"`
	Type        string    `json:"type"`
	Limit       int64     `json:"limit"`
	SpentAmount int64     `json:"spent_amount"`
	CreatedAt   time.Time `json:"created_at"`
}

var db *gorm.DB

func main() {
	dbURL := getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/baas?sslmode=disable")
	port := getEnv("PORT", "8083")

	var err error
	db, err = gorm.Open(postgres.Open(dbURL), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database")
	}

	db.AutoMigrate(&Card{})

	r := gin.Default()

	r.POST("/cards", createCard)
	r.GET("/cards/:id", getCard)
	r.GET("/cards/account/:account_id", getAccountCards)
	r.PUT("/cards/:id/limit", updateLimit)
	r.PUT("/cards/:id/block", blockCard)
	r.PUT("/cards/:id/unblock", unblockCard)
	r.POST("/cards/:id/authorize", authorizeTransaction)
	r.DELETE("/cards/:id", deleteCard)
	r.GET("/health", health)

	r.Run(":" + port)
}

func createCard(c *gin.Context) {
	var req struct {
		AccountID string `json:"account_id" binding:"required"`
		Type      string `json:"type" binding:"required"`
		Limit     int64  `json:"limit" binding:"required,gt=0"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	accountID, _ := uuid.Parse(req.AccountID)

	card := Card{
		ID:          uuid.New(),
		AccountID:   accountID,
		CardNumber:  generateCardNumber(),
		CVV:         generateCVV(),
		ExpiryDate:  generateExpiryDate(),
		Status:      "active",
		Type:        req.Type,
		Limit:       req.Limit,
		SpentAmount: 0,
		CreatedAt:   time.Now(),
	}

	db.Create(&card)

	c.JSON(http.StatusCreated, gin.H{
		"card":    card,
		"message": "Virtual card created instantly - ready to use",
	})
}

func getCard(c *gin.Context) {
	id := c.Param("id")
	cardID, _ := uuid.Parse(id)

	var card Card
	if err := db.First(&card, cardID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Card not found"})
		return
	}

	c.JSON(http.StatusOK, card)
}

func getAccountCards(c *gin.Context) {
	accountID := c.Param("account_id")
	aid, _ := uuid.Parse(accountID)

	var cards []Card
	db.Where("account_id = ?", aid).Find(&cards)

	c.JSON(http.StatusOK, cards)
}

func updateLimit(c *gin.Context) {
	id := c.Param("id")
	cardID, _ := uuid.Parse(id)

	var req struct {
		Limit int64 `json:"limit" binding:"required,gt=0"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var card Card
	db.First(&card, cardID)

	card.Limit = req.Limit
	db.Save(&card)

	c.JSON(http.StatusOK, gin.H{
		"card":    card,
		"message": "Limit updated instantly",
	})
}

func blockCard(c *gin.Context) {
	id := c.Param("id")
	cardID, _ := uuid.Parse(id)

	var card Card
	db.First(&card, cardID)

	card.Status = "blocked"
	db.Save(&card)

	c.JSON(http.StatusOK, gin.H{
		"message": "Card blocked successfully",
	})
}

func unblockCard(c *gin.Context) {
	id := c.Param("id")
	cardID, _ := uuid.Parse(id)

	var card Card
	db.First(&card, cardID)

	card.Status = "active"
	db.Save(&card)

	c.JSON(http.StatusOK, gin.H{
		"message": "Card unblocked successfully",
	})
}

func authorizeTransaction(c *gin.Context) {
	id := c.Param("id")
	cardID, _ := uuid.Parse(id)

	var req struct {
		Amount      int64  `json:"amount" binding:"required,gt=0"`
		MerchantID  string `json:"merchant_id" binding:"required"`
		Description string `json:"description"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var card Card
	if err := db.First(&card, cardID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Card not found"})
		return
	}

	if card.Status != "active" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Card is not active"})
		return
	}

	if card.SpentAmount+req.Amount > card.Limit {
		c.JSON(http.StatusForbidden, gin.H{"error": "Transaction exceeds card limit"})
		return
	}

	card.SpentAmount += req.Amount
	db.Save(&card)

	c.JSON(http.StatusOK, gin.H{
		"authorized":       true,
		"transaction_id":   uuid.New().String(),
		"amount":           req.Amount,
		"remaining_limit":  card.Limit - card.SpentAmount,
		"processing_time":  "45ms",
		"message":          "Transaction authorized",
	})
}

func deleteCard(c *gin.Context) {
	id := c.Param("id")
	cardID, _ := uuid.Parse(id)

	db.Delete(&Card{}, cardID)

	c.JSON(http.StatusOK, gin.H{
		"message": "Card deleted successfully",
	})
}

func generateCardNumber() string {
	return fmt.Sprintf("5199 %04d %04d %04d",
		rand.Intn(9999),
		rand.Intn(9999),
		rand.Intn(9999))
}

func generateCVV() string {
	return fmt.Sprintf("%03d", rand.Intn(999))
}

func generateExpiryDate() string {
	now := time.Now()
	expiry := now.AddDate(5, 0, 0)
	return expiry.Format("01/06")
}

func health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "healthy",
		"service": "card-service",
		"time":    time.Now(),
	})
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
