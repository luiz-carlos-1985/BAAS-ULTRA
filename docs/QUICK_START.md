# 🚀 Quick Start - BaaS Ultra

## Início Rápido em 5 Minutos

### 1. Pré-requisitos

```bash
- Docker & Docker Compose
- Go 1.21+ (opcional para desenvolvimento)
- Python 3.11+ (opcional para desenvolvimento)
- Node.js 20+ (opcional para desenvolvimento)
```

### 2. Iniciar Todos os Serviços

```bash
# Clone o repositório
cd baas-ultra

# Inicie todos os serviços
docker-compose up -d

# Aguarde ~30 segundos para todos os serviços iniciarem
```

### 3. Verificar Status

```bash
# API Gateway
curl http://localhost:8080/health

# Auth Service
curl http://localhost:8081/health

# Account Service
curl http://localhost:8082/health

# Card Service
curl http://localhost:8083/health

# KYC Service
curl http://localhost:8085/health

# Risk Service
curl http://localhost:8086/health
```

### 4. Criar Sua Primeira Conta

#### Passo 1: Registrar Usuário

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "SenhaSegura123!",
    "full_name": "João Silva",
    "document_number": "12345678900",
    "phone": "+5511999999999"
  }'
```

Resposta:
```json
{
  "user": {
    "id": "uuid-aqui",
    "email": "joao@example.com",
    "full_name": "João Silva",
    "kyc_status": "pending"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Passo 2: Criar Conta Bancária

```bash
curl -X POST http://localhost:8080/api/v1/accounts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "user_id": "SEU_USER_ID_AQUI",
    "currency": "BRL",
    "type": "checking"
  }'
```

Resposta:
```json
{
  "account": {
    "id": "uuid-conta",
    "account_number": "12345678-9",
    "currency": "BRL",
    "balance": 0,
    "status": "active"
  },
  "message": "Account created in 2 seconds"
}
```

#### Passo 3: Criar Cartão Virtual

```bash
curl -X POST http://localhost:8080/api/v1/cards \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "account_id": "SEU_ACCOUNT_ID_AQUI",
    "type": "virtual",
    "limit": 500000
  }'
```

Resposta:
```json
{
  "card": {
    "id": "uuid-cartao",
    "card_number": "5199 1234 5678 9012",
    "cvv": "123",
    "expiry_date": "12/29",
    "status": "active",
    "limit": 500000
  },
  "message": "Virtual card created instantly - ready to use"
}
```

#### Passo 4: Verificar KYC com IA

```bash
curl -X POST http://localhost:8080/api/v1/kyc/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "user_id": "SEU_USER_ID_AQUI",
    "document_type": "CPF",
    "document_number": "12345678900",
    "face_image": "base64_image_data",
    "document_image": "base64_image_data"
  }'
```

Resposta:
```json
{
  "verification": {
    "status": "approved",
    "face_match": 0.95,
    "liveness_score": 0.92,
    "aml_check": true
  },
  "message": "KYC verification completed with AI",
  "details": {
    "processing_time_ms": 150
  }
}
```

#### Passo 5: Fazer Transferência com Análise de Risco

```bash
curl -X POST http://localhost:8080/api/v1/accounts/transfer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "from_account_id": "CONTA_ORIGEM",
    "to_account_id": "CONTA_DESTINO",
    "amount": 10000,
    "description": "Pagamento teste"
  }'
```

Resposta:
```json
{
  "transaction": {
    "id": "uuid-transacao",
    "amount": 10000,
    "status": "completed"
  },
  "risk_assessment": {
    "risk_score": 0.15,
    "risk_level": "low",
    "action": "approve",
    "processing_time_ms": 45
  },
  "message": "Transfer completed instantly"
}
```

## 🔥 Funcionalidades Avançadas

### Autenticação Biométrica

```bash
curl -X POST http://localhost:8080/api/v1/auth/biometric \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "SEU_USER_ID",
    "biometric_data": "base64_biometric_data"
  }'
```

### Detecção de Fraude

```bash
curl -X POST http://localhost:8080/api/v1/risk/fraud-detection \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "transaction": {
      "amount": 50000,
      "from_account": "conta1",
      "to_account": "conta2"
    }
  }'
```

### Credit Score com ML

```bash
curl -X POST http://localhost:8080/api/v1/risk/credit-score \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "user_id": "SEU_USER_ID"
  }'
```

### Detecção de Liveness (Anti-Deepfake)

```bash
curl -X POST http://localhost:8080/api/v1/kyc/liveness \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "video_data": "base64_video_data"
  }'
```

## 📊 Monitoramento

### Prometheus Metrics
```
http://localhost:9090
```

### Grafana Dashboards
```
http://localhost:3000
Username: admin
Password: admin
```

### Neo4j Graph Database (Análise de Redes)
```
http://localhost:7474
Username: neo4j
Password: password
```

## 🛠️ Desenvolvimento Local

### Rodar Serviço Individual

#### Auth Service (Go)
```bash
cd services/auth-service
go mod download
go run main.go
```

#### KYC Service (Python)
```bash
cd services/kyc-service
pip install -r requirements.txt
python main.py
```

#### API Gateway (Node.js)
```bash
cd api-gateway
npm install
npm start
```

## 🔒 Variáveis de Ambiente

Crie um arquivo `.env`:

```env
# Database
DATABASE_URL=postgres://postgres:postgres@localhost:5432/baas?sslmode=disable

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=ultra-secret-key-change-in-production

# Services
AUTH_SERVICE_URL=http://localhost:8081
ACCOUNT_SERVICE_URL=http://localhost:8082
CARD_SERVICE_URL=http://localhost:8083
KYC_SERVICE_URL=http://localhost:8085
RISK_SERVICE_URL=http://localhost:8086
```

## 📚 Próximos Passos

1. Explore a [Documentação Completa](./API_REFERENCE.md)
2. Veja [Exemplos de Integração](./INTEGRATION_EXAMPLES.md)
3. Configure [Webhooks](./WEBHOOKS.md)
4. Implemente [Security Best Practices](./SECURITY.md)

## 🆘 Suporte

- Issues: GitHub Issues
- Documentação: `/docs`
- API Docs: `http://localhost:8080/api/v1/docs`
