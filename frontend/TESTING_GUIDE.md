# 📱 Guia de Testes de Responsividade

## Dispositivos para Testar

### 📱 Smartphones

#### iOS
- **iPhone SE (2020)**: 375 x 667px
- **iPhone 12/13/14**: 390 x 844px
- **iPhone 14 Pro Max**: 430 x 932px
- **iPhone 11 Pro**: 375 x 812px

#### Android
- **Samsung Galaxy S21**: 360 x 800px
- **Google Pixel 5**: 393 x 851px
- **OnePlus 9**: 412 x 915px
- **Xiaomi Mi 11**: 360 x 780px

### 📱 Tablets

#### iOS
- **iPad Mini**: 768 x 1024px
- **iPad Air**: 820 x 1180px
- **iPad Pro 11"**: 834 x 1194px
- **iPad Pro 12.9"**: 1024 x 1366px

#### Android
- **Samsung Galaxy Tab S7**: 800 x 1280px
- **Lenovo Tab P11**: 1200 x 2000px

### 💻 Desktop

- **Laptop HD**: 1366 x 768px
- **Desktop Full HD**: 1920 x 1080px
- **Desktop 2K**: 2560 x 1440px
- **Desktop 4K**: 3840 x 2160px

## Chrome DevTools - Testes Rápidos

### Atalhos Úteis
- `Ctrl + Shift + M` (Windows) / `Cmd + Shift + M` (Mac): Toggle device toolbar
- `Ctrl + Shift + C`: Inspect element
- `Ctrl + Shift + P`: Command palette

### Dispositivos Pré-configurados
1. Abra DevTools
2. Clique no ícone de dispositivo móvel
3. Selecione dispositivo no dropdown
4. Teste orientação portrait/landscape

### Throttling de Rede
- Fast 3G
- Slow 3G
- Offline

## Checklist de Testes

### ✅ Layout
- [ ] Todos os elementos visíveis sem scroll horizontal
- [ ] Textos não cortados ou sobrepostos
- [ ] Imagens e ícones proporcionais
- [ ] Espaçamento consistente
- [ ] Cards e containers bem alinhados

### ✅ Tipografia
- [ ] Textos legíveis (mínimo 14px em mobile)
- [ ] Hierarquia visual clara
- [ ] Line-height adequado
- [ ] Sem zoom automático em inputs (iOS)

### ✅ Touch Targets
- [ ] Botões com mínimo 44x44px
- [ ] Espaçamento entre elementos clicáveis
- [ ] Feedback visual em tap
- [ ] Sem double-tap zoom indesejado

### ✅ Formulários
- [ ] Inputs com altura adequada (min 44px)
- [ ] Labels visíveis e associados
- [ ] Placeholders descritivos
- [ ] Teclado apropriado (email, tel, number)
- [ ] Validação clara

### ✅ Navegação
- [ ] Menu acessível em mobile
- [ ] Breadcrumbs visíveis
- [ ] Botão voltar funcional
- [ ] Links com área de toque adequada

### ✅ Imagens e Mídia
- [ ] Imagens responsivas (srcset)
- [ ] Lazy loading implementado
- [ ] Alt text presente
- [ ] Vídeos com controles

### ✅ Performance
- [ ] Carregamento < 3s em 3G
- [ ] Animações suaves (60fps)
- [ ] Sem layout shifts (CLS < 0.1)
- [ ] First Contentful Paint < 1.8s

### ✅ Acessibilidade
- [ ] Navegação por teclado
- [ ] Screen reader friendly
- [ ] Contraste adequado (WCAG AA)
- [ ] Focus indicators visíveis
- [ ] ARIA labels quando necessário

### ✅ Orientação
- [ ] Portrait funcional
- [ ] Landscape funcional
- [ ] Transição suave entre orientações

### ✅ Browsers
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (iOS/macOS)
- [ ] Samsung Internet

## Ferramentas de Teste

### Online
- **BrowserStack**: Testes em dispositivos reais
- **LambdaTest**: Cross-browser testing
- **Responsinator**: Visualização rápida
- **Am I Responsive**: Screenshots múltiplos

### Lighthouse
```bash
npm install -g lighthouse
lighthouse http://localhost:3001 --view
```

### Métricas Alvo
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

## Testes Manuais

### Gestos Touch
- [ ] Tap
- [ ] Double tap
- [ ] Long press
- [ ] Swipe (se aplicável)
- [ ] Pinch to zoom (desabilitado em forms)

### Teclado Virtual
- [ ] Não cobre campos importantes
- [ ] Scroll automático para campo focado
- [ ] Tipo de teclado correto
- [ ] Botão "Done/Go" funcional

### Notch/Safe Areas
- [ ] Conteúdo não cortado em iPhone X+
- [ ] Status bar respeitada
- [ ] Bottom bar respeitada

## Comandos Úteis

### Iniciar servidor local
```bash
npm run dev
```

### Build de produção
```bash
npm run build
npm run preview
```

### Análise de bundle
```bash
npm run build -- --mode analyze
```

## Problemas Comuns

### Zoom Indesejado (iOS)
**Solução**: Font-size mínimo 16px em inputs

### Scroll Horizontal
**Solução**: `overflow-x: hidden` e `max-width: 100%`

### Hover em Touch
**Solução**: Usar `@media (hover: hover)` para hover states

### Layout Shift
**Solução**: Definir width/height em imagens e containers

### Performance Lenta
**Solução**: Code splitting, lazy loading, otimizar imagens

## Relatório de Bugs

### Template
```markdown
**Dispositivo**: iPhone 12
**Browser**: Safari 15
**Viewport**: 390 x 844px
**Orientação**: Portrait

**Problema**: Botão cortado na parte inferior

**Passos para reproduzir**:
1. Abrir página de login
2. Rolar até o final
3. Observar botão "Entrar"

**Comportamento esperado**: Botão totalmente visível

**Screenshot**: [anexar]
```

---

**Teste em dispositivos reais sempre que possível!** 📱✨
