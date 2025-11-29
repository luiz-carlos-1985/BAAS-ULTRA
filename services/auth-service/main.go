package main

import (
	"crypto/rand"
	"encoding/base64"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

type User struct {
	ID             string `json:"id" gorm:"primaryKey"`
	Email          string    `json:"email" gorm:"uniqueIndex"`
	PasswordHash   string    `json:"-"`
	FullName       string    `json:"full_name"`
	DocumentNumber string    `json:"document_number" gorm:"uniqueIndex"`
	Phone          string    `json:"phone"`
	KYCStatus      string    `json:"kyc_status"`
	RiskLevel      string    `json:"risk_level"`
	BiometricHash  string    `json:"biometric_hash"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

var db *gorm.DB
var jwtSecret string

type RegisterRequest struct {
	Email          string `json:"email" binding:"required,email"`
	Password       string `json:"password" binding:"required,min=8"`
	FullName       string `json:"full_name" binding:"required"`
	DocumentNumber string `json:"document_number" binding:"required"`
	Phone          string `json:"phone" binding:"required"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type BiometricAuthRequest struct {
	UserID        string `json:"user_id" binding:"required"`
	BiometricData string `json:"biometric_data" binding:"required"`
}

func main() {
	jwtSecret = getEnv("JWT_SECRET", "ultra-secret-key")
	dbFile := getEnv("DB_FILE", "baas.db")
	port := getEnv("PORT", "8081")

	var err error
	db, err = gorm.Open(sqlite.Open(dbFile), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database")
	}

	db.AutoMigrate(&User{})

	r := gin.Default()

	r.POST("/auth/register", register)
	r.POST("/auth/login", login)
	r.POST("/auth/biometric", biometricAuth)
	r.POST("/auth/refresh", refreshToken)
	r.POST("/auth/passwordless", passwordlessAuth)
	r.GET("/health", health)

	r.Run(":" + port)
}

func register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		println("Validation error:", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)

	user := User{
		ID:             uuid.New().String(),
		Email:          req.Email,
		PasswordHash:   string(hashedPassword),
		FullName:       req.FullName,
		DocumentNumber: req.DocumentNumber,
		Phone:          req.Phone,
		KYCStatus:      "pending",
		RiskLevel:      "low",
		CreatedAt:      time.Now(),
		UpdatedAt:      time.Now(),
	}

	if err := db.Create(&user).Error; err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "User already exists"})
		return
	}

	token, _ := generateJWT(user.ID, user.Email)

	c.JSON(http.StatusCreated, gin.H{
		"user":    user,
		"token":   token,
		"message": "Account created successfully",
	})
}

func login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user User
	if err := db.Where("email = ?", req.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	token, _ := generateJWT(user.ID, user.Email)

	c.JSON(http.StatusOK, gin.H{
		"user":  user,
		"token": token,
	})
}

func biometricAuth(c *gin.Context) {
	var req BiometricAuthRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user User
	if err := db.First(&user, req.UserID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Simulação de verificação biométrica (integrar com serviço de IA)
	biometricScore := 0.95

	if biometricScore < 0.85 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Biometric verification failed"})
		return
	}

	token, _ := generateJWT(user.ID, user.Email)

	c.JSON(http.StatusOK, gin.H{
		"token":           token,
		"biometric_score": biometricScore,
		"verified":        true,
	})
}

func passwordlessAuth(c *gin.Context) {
	var req struct {
		Email string `json:"email" binding:"required,email"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user User
	if err := db.Where("email = ?", req.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	magicLink, _ := generateSecureToken()

	c.JSON(http.StatusOK, gin.H{
		"message":    "Magic link sent to email",
		"magic_link": magicLink,
	})
}

func refreshToken(c *gin.Context) {
	oldToken := c.GetHeader("Authorization")
	if oldToken == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No token provided"})
		return
	}

	claims := jwt.MapClaims{}
	jwt.ParseWithClaims(oldToken, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(jwtSecret), nil
	})

	userID := claims["user_id"].(string)
	email := claims["email"].(string)

	newToken, _ := generateJWT(userID, email)

	c.JSON(http.StatusOK, gin.H{"token": newToken})
}

func generateJWT(userID, email string) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"email":   email,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
		"iat":     time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(jwtSecret))
}

func generateSecureToken() (string, error) {
	b := make([]byte, 32)
	rand.Read(b)
	return base64.URLEncoding.EncodeToString(b), nil
}

func health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "healthy",
		"service": "auth-service",
		"time":    time.Now(),
	})
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
