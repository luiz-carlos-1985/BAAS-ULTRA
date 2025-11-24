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

type Account struct {
	ID            uuid.UUID `json:"id" gorm:"type:uuid;primary_key"`
	UserID        uuid.UUID `json:"user_id" gorm:"type:uuid;index"`
	AccountNumber string    `json:"account_number" gorm:"uniqueIndex"`
	Currency      string    `json:"currency"`
	Balance       int64     `json:"balance"`
	Status        string    `json:"status"`
	Type          string    `json:"type"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type Transaction struct {
	ID            uuid.UUID `json:"id" gorm:"type:uuid;primary_key"`
	FromAccountID uuid.UUID `json:"from_account_id" gorm:"type:uuid;index"`
	ToAccountID   uuid.UUID `json:"to_account_id" gorm:"type:uuid;index"`
	Amount        int64     `json:"amount"`
	Currency      string    `json:"currency"`
	Type          string    `json:"type"`
	Status        string    `json:"status"`
	Description   string    `json:"description"`
	RiskScore     float64   `json:"risk_score"`
	CreatedAt     time.Time `json:"created_at"`
}

var db *gorm.DB

func main() {
	dbURL := getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/baas?sslmode=disable")
	port := getEnv("PORT", "8082")

	var err error
	db, err = gorm.Open(postgres.Open(dbURL), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database")
	}

	db.AutoMigrate(&Account{}, &Transaction{})

	r := gin.Default()

	r.POST("/accounts", createAccount)
	r.GET("/accounts/:id", getAccount)
	r.GET("/accounts/user/:user_id", getUserAccounts)
	r.GET("/accounts/:id/balance", getBalance)
	r.POST("/accounts/transfer", transfer)
	r.GET("/accounts/:id/transactions", getTransactions)
	r.POST("/accounts/:id/deposit", deposit)
	r.POST("/accounts/:id/withdraw", withdraw)
	r.GET("/health", health)

	r.Run(":" + port)
}

func createAccount(c *gin.Context) {
	var req struct {
		UserID   string `json:"user_id" binding:"required"`
		Currency string `json:"currency" binding:"required"`
		Type     string `json:"type" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := uuid.Parse(req.UserID)

	account := Account{
		ID:            uuid.New(),
		UserID:        userID,
		AccountNumber: generateAccountNumber(),
		Currency:      req.Currency,
		Balance:       0,
		Status:        "active",
		Type:          req.Type,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	db.Create(&account)

	c.JSON(http.StatusCreated, gin.H{
		"account": account,
		"message": "Account created in 2 seconds",
	})
}

func getAccount(c *gin.Context) {
	id := c.Param("id")
	accountID, _ := uuid.Parse(id)

	var account Account
	if err := db.First(&account, accountID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Account not found"})
		return
	}

	c.JSON(http.StatusOK, account)
}

func getUserAccounts(c *gin.Context) {
	userID := c.Param("user_id")
	uid, _ := uuid.Parse(userID)

	var accounts []Account
	db.Where("user_id = ?", uid).Find(&accounts)

	c.JSON(http.StatusOK, accounts)
}

func getBalance(c *gin.Context) {
	id := c.Param("id")
	accountID, _ := uuid.Parse(id)

	var account Account
	if err := db.First(&account, accountID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Account not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"account_id": account.ID,
		"balance":    account.Balance,
		"currency":   account.Currency,
		"formatted":  fmt.Sprintf("%s %.2f", account.Currency, float64(account.Balance)/100.0),
	})
}

func transfer(c *gin.Context) {
	var req struct {
		FromAccountID string `json:"from_account_id" binding:"required"`
		ToAccountID   string `json:"to_account_id" binding:"required"`
		Amount        int64  `json:"amount" binding:"required,gt=0"`
		Description   string `json:"description"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fromID, _ := uuid.Parse(req.FromAccountID)
	toID, _ := uuid.Parse(req.ToAccountID)

	tx := db.Begin()

	var fromAccount, toAccount Account
	tx.First(&fromAccount, fromID)
	tx.First(&toAccount, toID)

	if fromAccount.Balance < req.Amount {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient balance"})
		return
	}

	fromAccount.Balance -= req.Amount
	toAccount.Balance += req.Amount

	tx.Save(&fromAccount)
	tx.Save(&toAccount)

	transaction := Transaction{
		ID:            uuid.New(),
		FromAccountID: fromID,
		ToAccountID:   toID,
		Amount:        req.Amount,
		Currency:      fromAccount.Currency,
		Type:          "transfer",
		Status:        "completed",
		Description:   req.Description,
		RiskScore:     0.1,
		CreatedAt:     time.Now(),
	}

	tx.Create(&transaction)
	tx.Commit()

	c.JSON(http.StatusOK, gin.H{
		"transaction": transaction,
		"message":     "Transfer completed instantly",
	})
}

func deposit(c *gin.Context) {
	id := c.Param("id")
	accountID, _ := uuid.Parse(id)

	var req struct {
		Amount int64 `json:"amount" binding:"required,gt=0"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var account Account
	db.First(&account, accountID)

	account.Balance += req.Amount
	db.Save(&account)

	c.JSON(http.StatusOK, gin.H{
		"account": account,
		"message": "Deposit successful",
	})
}

func withdraw(c *gin.Context) {
	id := c.Param("id")
	accountID, _ := uuid.Parse(id)

	var req struct {
		Amount int64 `json:"amount" binding:"required,gt=0"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var account Account
	db.First(&account, accountID)

	if account.Balance < req.Amount {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient balance"})
		return
	}

	account.Balance -= req.Amount
	db.Save(&account)

	c.JSON(http.StatusOK, gin.H{
		"account": account,
		"message": "Withdrawal successful",
	})
}

func getTransactions(c *gin.Context) {
	id := c.Param("id")
	accountID, _ := uuid.Parse(id)

	var transactions []Transaction
	db.Where("from_account_id = ? OR to_account_id = ?", accountID, accountID).
		Order("created_at DESC").
		Limit(100).
		Find(&transactions)

	c.JSON(http.StatusOK, transactions)
}

func generateAccountNumber() string {
	return fmt.Sprintf("%08d-%d", rand.Intn(99999999), rand.Intn(9))
}

func health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "healthy",
		"service": "account-service",
		"time":    time.Now(),
	})
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
