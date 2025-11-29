package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Payment struct {
	ID            uuid.UUID `json:"id" gorm:"type:uuid;primary_key"`
	FromAccountID uuid.UUID `json:"from_account_id" gorm:"type:uuid;index"`
	ToAccountID   uuid.UUID `json:"to_account_id" gorm:"type:uuid;index"`
	Amount        int64     `json:"amount"`
	Currency      string    `json:"currency"`
	Type          string    `json:"type"`
	Status        string    `json:"status"`
	PIXKey        string    `json:"pix_key"`
	QRCode        string    `json:"qr_code"`
	Metadata      string    `json:"metadata" gorm:"type:jsonb"`
	CreatedAt     time.Time `json:"created_at"`
	CompletedAt   *time.Time `json:"completed_at"`
}

var db *gorm.DB

func main() {
	dbURL := getEnv("DATABASE_URL", "postgres://postgres:123456@localhost:5432/baas?sslmode=disable")
	port := getEnv("PORT", "8084")

	var err error
	db, err = gorm.Open(postgres.Open(dbURL), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database")
	}

	db.AutoMigrate(&Payment{})

	r := gin.Default()

	r.POST("/payments/pix", pixPayment)
	r.POST("/payments/pix/qrcode", generatePixQRCode)
	r.POST("/payments/ted", tedPayment)
	r.POST("/payments/wire", wireTransfer)
	r.POST("/payments/boleto", generateBoleto)
	r.GET("/payments/:id", getPayment)
	r.POST("/payments/:id/refund", refundPayment)
	r.POST("/payments/batch", batchPayment)
	r.GET("/health", health)

	r.Run(":" + port)
}

func pixPayment(c *gin.Context) {
	var req struct {
		FromAccountID string `json:"from_account_id" binding:"required"`
		PIXKey        string `json:"pix_key" binding:"required"`
		Amount        int64  `json:"amount" binding:"required,gt=0"`
		Description   string `json:"description"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fromID, _ := uuid.Parse(req.FromAccountID)
	toID := uuid.New()

	metadata, _ := json.Marshal(map[string]interface{}{
		"description": req.Description,
		"pix_type":    "instant",
	})

	payment := Payment{
		ID:            uuid.New(),
		FromAccountID: fromID,
		ToAccountID:   toID,
		Amount:        req.Amount,
		Currency:      "BRL",
		Type:          "pix",
		Status:        "completed",
		PIXKey:        req.PIXKey,
		Metadata:      string(metadata),
		CreatedAt:     time.Now(),
		CompletedAt:   timePtr(time.Now()),
	}

	db.Create(&payment)

	c.JSON(http.StatusOK, gin.H{
		"payment":         payment,
		"processing_time": "1.2s",
		"message":         "PIX payment completed instantly",
	})
}

func generatePixQRCode(c *gin.Context) {
	var req struct {
		AccountID   string `json:"account_id" binding:"required"`
		Amount      int64  `json:"amount" binding:"required,gt=0"`
		Description string `json:"description"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	qrCode := fmt.Sprintf("00020126580014br.gov.bcb.pix0136%s520400005303986540%d.%02d5802BR5913%s6009SAO PAULO",
		uuid.New().String()[:36],
		req.Amount/100,
		req.Amount%100,
		"MERCHANT")

	c.JSON(http.StatusOK, gin.H{
		"qr_code":     qrCode,
		"qr_code_url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
		"expires_at":  time.Now().Add(30 * time.Minute),
		"message":     "QR Code generated",
	})
}

func tedPayment(c *gin.Context) {
	var req struct {
		FromAccountID string `json:"from_account_id" binding:"required"`
		ToBank        string `json:"to_bank" binding:"required"`
		ToAgency      string `json:"to_agency" binding:"required"`
		ToAccount     string `json:"to_account" binding:"required"`
		Amount        int64  `json:"amount" binding:"required,gt=0"`
		Description   string `json:"description"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fromID, _ := uuid.Parse(req.FromAccountID)

	metadata, _ := json.Marshal(map[string]interface{}{
		"to_bank":    req.ToBank,
		"to_agency":  req.ToAgency,
		"to_account": req.ToAccount,
	})

	payment := Payment{
		ID:            uuid.New(),
		FromAccountID: fromID,
		ToAccountID:   uuid.New(),
		Amount:        req.Amount,
		Currency:      "BRL",
		Type:          "ted",
		Status:        "processing",
		Metadata:      string(metadata),
		CreatedAt:     time.Now(),
	}

	db.Create(&payment)

	c.JSON(http.StatusOK, gin.H{
		"payment": payment,
		"message": "TED scheduled - will be processed in next banking window",
	})
}

func wireTransfer(c *gin.Context) {
	var req struct {
		FromAccountID string `json:"from_account_id" binding:"required"`
		ToIBAN        string `json:"to_iban" binding:"required"`
		ToSWIFT       string `json:"to_swift" binding:"required"`
		Amount        int64  `json:"amount" binding:"required,gt=0"`
		Currency      string `json:"currency" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fromID, _ := uuid.Parse(req.FromAccountID)

	metadata, _ := json.Marshal(map[string]interface{}{
		"to_iban":  req.ToIBAN,
		"to_swift": req.ToSWIFT,
	})

	payment := Payment{
		ID:            uuid.New(),
		FromAccountID: fromID,
		ToAccountID:   uuid.New(),
		Amount:        req.Amount,
		Currency:      req.Currency,
		Type:          "wire",
		Status:        "processing",
		Metadata:      string(metadata),
		CreatedAt:     time.Now(),
	}

	db.Create(&payment)

	c.JSON(http.StatusOK, gin.H{
		"payment":      payment,
		"estimated_at": time.Now().Add(24 * time.Hour),
		"message":      "International wire transfer initiated",
	})
}

func generateBoleto(c *gin.Context) {
	var req struct {
		AccountID   string    `json:"account_id" binding:"required"`
		Amount      int64     `json:"amount" binding:"required,gt=0"`
		DueDate     time.Time `json:"due_date" binding:"required"`
		Description string    `json:"description"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	boletoCode := fmt.Sprintf("34191.79001 01043.510047 91020.150008 1 %d", time.Now().Unix())

	c.JSON(http.StatusOK, gin.H{
		"boleto_code": boletoCode,
		"barcode":     "34191790010104351004791020150008100000" + fmt.Sprint(req.Amount),
		"due_date":    req.DueDate,
		"pdf_url":     "https://api.example.com/boletos/" + uuid.New().String() + ".pdf",
		"message":     "Boleto generated successfully",
	})
}

func getPayment(c *gin.Context) {
	id := c.Param("id")
	paymentID, _ := uuid.Parse(id)

	var payment Payment
	if err := db.First(&payment, paymentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
		return
	}

	c.JSON(http.StatusOK, payment)
}

func refundPayment(c *gin.Context) {
	id := c.Param("id")
	paymentID, _ := uuid.Parse(id)

	var payment Payment
	if err := db.First(&payment, paymentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
		return
	}

	payment.Status = "refunded"
	db.Save(&payment)

	c.JSON(http.StatusOK, gin.H{
		"payment": payment,
		"message": "Payment refunded successfully",
	})
}

func batchPayment(c *gin.Context) {
	var req struct {
		Payments []struct {
			ToAccount string `json:"to_account"`
			Amount    int64  `json:"amount"`
		} `json:"payments" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	batchID := uuid.New()
	processed := 0

	for _, p := range req.Payments {
		payment := Payment{
			ID:          uuid.New(),
			ToAccountID: uuid.New(),
			Amount:      p.Amount,
			Currency:    "BRL",
			Type:        "batch",
			Status:      "completed",
			CreatedAt:   time.Now(),
		}
		db.Create(&payment)
		processed++
	}

	c.JSON(http.StatusOK, gin.H{
		"batch_id":  batchID,
		"processed": processed,
		"total":     len(req.Payments),
		"message":   "Batch payment processed",
	})
}

func health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "healthy",
		"service": "payment-service",
		"time":    time.Now(),
	})
}

func timePtr(t time.Time) *time.Time {
	return &t
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
