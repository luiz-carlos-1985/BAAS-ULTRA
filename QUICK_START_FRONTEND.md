# 🚀 Quick Start - Frontend BaaS Ultra

## ⚡ Início Rápido (2 minutos)

### 1. Instalação
```bash
cd frontend
npm install
```

### 2. Executar
```bash
npm run dev
```

### 3. Acessar
```
http://localhost:3001
```

### 4. Login Demo
```
Email: admin@baas.com
Senha: 123456
```

## ✨ Features Disponíveis

### 🔐 Autenticação
- ✅ Login animado
- ✅ Registro completo
- ✅ Persistência sessão
- ✅ Demo rápido

### 📊 Dashboard
- ✅ 4 Cards estatísticas
- ✅ Gráficos interativos
- ✅ Transações recentes
- ✅ Criação conta/cartão

### 🎨 Interface
- ✅ Glassmorphism
- ✅ Animações fluidas
- ✅ Responsivo total
- ✅ Dark mode

## 🔧 Comandos

```bash
# Desenvolvimento
npm run dev

# Build produção
npm run build

# Preview build
npm run preview

# Lint
npm run lint
```

## 📱 Responsividade

- **Mobile**: 320px+
- **Tablet**: 768px+
- **Desktop**: 1024px+
- **4K**: 1536px+

## 🎯 Estrutura Rápida

```
frontend/
├── src/
│   ├── components/     # Componentes React
│   ├── services/       # API e mock
│   ├── store/         # Zustand store
│   └── App.jsx        # App principal
├── public/            # Assets estáticos
└── package.json       # Dependências
```

## 🚀 Deploy Rápido

### Vercel (Recomendado)
```bash
npm run build
npx vercel --prod
```

### Netlify
```bash
npm run build
npx netlify-cli deploy --prod --dir=dist
```

## 🔄 Mock vs Real API

### Mock (Padrão)
```javascript
// src/services/api.js
const USE_MOCK = true
```

### Real API
```javascript
// src/services/api.js
const USE_MOCK = false
```

## 🎨 Customização

### Cores
```css
/* tailwind.config.js */
colors: {
  primary: '#6366f1',
  dark: '#0f172a',
  'dark-light': '#334155'
}
```

### Animações
```css
/* src/index.css */
.glass { backdrop-filter: blur(24px); }
.glow { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); }
```

## 🐛 Troubleshooting

### Porta ocupada
```bash
# Usar porta diferente
npm run dev -- --port 3002
```

### Cache limpo
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build erro
```bash
npm run build -- --mode development
```

---

**Pronto!** Frontend 100% funcional em 2 minutos 🚀