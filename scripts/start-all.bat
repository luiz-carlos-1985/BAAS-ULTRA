@echo off
echo ========================================
echo   BaaS Ultra - Starting All Services
echo ========================================
echo.

echo [1/8] Starting API Gateway...
cd api-gateway
start cmd /k "npm start"
cd ..

timeout /t 2 /nobreak > nul

echo [2/8] Starting Auth Service...
cd services\auth-service
start cmd /k "go run main.go"
cd ..\..

timeout /t 2 /nobreak > nul

echo [3/8] Starting Account Service...
cd services\account-service
start cmd /k "go run main.go"
cd ..\..

timeout /t 2 /nobreak > nul

echo [4/8] Starting Card Service...
cd services\card-service
start cmd /k "go run main.go"
cd ..\..

timeout /t 2 /nobreak > nul

echo [5/8] Starting Payment Service...
cd services\payment-service
start cmd /k "go run main.go"
cd ..\..

timeout /t 2 /nobreak > nul

echo [6/8] Starting KYC Service...
cd services\kyc-service
start cmd /k "python main.py"
cd ..\..

timeout /t 2 /nobreak > nul

echo [7/8] Starting Risk Service...
cd services\risk-service
start cmd /k "python main.py"
cd ..\..

timeout /t 2 /nobreak > nul

echo [8/8] Starting Ledger Service...
cd services\ledger-service
start cmd /k "cargo run"
cd ..\..

echo.
echo ========================================
echo   All Services Started!
echo ========================================
echo.
echo API Gateway: http://localhost:8080
echo Documentation: http://localhost:8080/api/v1/docs
echo.
pause
