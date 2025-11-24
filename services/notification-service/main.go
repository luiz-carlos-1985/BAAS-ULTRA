package main

import (
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Notification struct {
	ID      string    `json:"id"`
	UserID  string    `json:"user_id"`
	Type    string    `json:"type"`
	Channel string    `json:"channel"`
	Title   string    `json:"title"`
	Message string    `json:"message"`
	Status  string    `json:"status"`
	SentAt  time.Time `json:"sent_at"`
}

func main() {
	port := getEnv("PORT", "8089")
	r := gin.Default()

	r.POST("/notifications/send", sendNotification)
	r.POST("/notifications/email", sendEmail)
	r.POST("/notifications/sms", sendSMS)
	r.POST("/notifications/push", sendPush)
	r.POST("/notifications/webhook", triggerWebhook)
	r.GET("/health", health)

	r.Run(":" + port)
}

func sendNotification(c *gin.Context) {
	var req struct {
		UserID  string `json:"user_id" binding:"required"`
		Type    string `json:"type" binding:"required"`
		Channel string `json:"channel" binding:"required"`
		Title   string `json:"title" binding:"required"`
		Message string `json:"message" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	notification := Notification{
		ID:      uuid.New().String(),
		UserID:  req.UserID,
		Type:    req.Type,
		Channel: req.Channel,
		Title:   req.Title,
		Message: req.Message,
		Status:  "sent",
		SentAt:  time.Now(),
	}

	c.JSON(http.StatusOK, gin.H{
		"notification": notification,
		"message":      "Notification sent successfully",
	})
}

func sendEmail(c *gin.Context) {
	var req struct {
		To      string `json:"to" binding:"required,email"`
		Subject string `json:"subject" binding:"required"`
		Body    string `json:"body" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"email_id": uuid.New().String(),
		"to":       req.To,
		"status":   "sent",
		"sent_at":  time.Now(),
	})
}

func sendSMS(c *gin.Context) {
	var req struct {
		Phone   string `json:"phone" binding:"required"`
		Message string `json:"message" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"sms_id":  uuid.New().String(),
		"phone":   req.Phone,
		"status":  "sent",
		"sent_at": time.Now(),
	})
}

func sendPush(c *gin.Context) {
	var req struct {
		UserID string `json:"user_id" binding:"required"`
		Title  string `json:"title" binding:"required"`
		Body   string `json:"body" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"push_id": uuid.New().String(),
		"user_id": req.UserID,
		"status":  "sent",
		"sent_at": time.Now(),
	})
}

func triggerWebhook(c *gin.Context) {
	var req struct {
		URL   string                 `json:"url" binding:"required"`
		Event string                 `json:"event" binding:"required"`
		Data  map[string]interface{} `json:"data" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"webhook_id": uuid.New().String(),
		"url":        req.URL,
		"event":      req.Event,
		"status":     "triggered",
		"sent_at":    time.Now(),
	})
}

func health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "healthy",
		"service": "notification-service",
		"time":    time.Now(),
	})
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
