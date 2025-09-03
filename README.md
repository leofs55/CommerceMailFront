# 🛒 CommerceMail

> **Sua plataforma de e-commerce completa e intuitiva para gerenciar produtos, carrinhos e vendas online.**

## 📋 Descrição do Projeto

O **CommerceMail** é uma aplicação web moderna e responsiva desenvolvida em Angular, que oferece uma solução completa para e-commerce. O projeto foi desenvolvido com foco na experiência do usuário, proporcionando uma interface intuitiva tanto para clientes quanto para administradores.

### 🎯 Principais Objetivos

- **Para Clientes**: Navegação fácil por produtos, carrinho de compras intuitivo e processo de pagamento simplificado
- **Para Administradores**: Painel completo de gerenciamento de produtos, categorias, usuários e feedbacks
- **Sistema Robusto**: Autenticação segura, gerenciamento de estado eficiente e arquitetura escalável

### 🔧 Problemas Resolvidos

- Simplificação do processo de compra online
- Centralização do gerenciamento de produtos e vendas
- Interface responsiva para todos os dispositivos
- Sistema de autenticação seguro e confiável

## 🚀 Status do Projeto

**Em Desenvolvimento** 🚧

O projeto está em fase ativa de desenvolvimento, com funcionalidades principais implementadas e melhorias contínuas sendo adicionadas.

## 🛠️ Tecnologias Utilizadas

### **Tecnologias Principais**
- **Angular 20.1.0** - Framework principal para desenvolvimento frontend
- **TypeScript 5.8.2** - Linguagem de programação tipada
- **RxJS 7.8.0** - Biblioteca para programação reativa
- **Zone.js 0.15.0** - Gerenciamento de mudanças e detecção de eventos

### **Ferramentas de Desenvolvimento**
- **Angular CLI 20.1.1** - Interface de linha de comando do Angular
- **Angular Build 20.1.1** - Sistema de build otimizado
- **Karma 6.4.0** - Framework de testes
- **Jasmine 5.8.0** - Framework de testes unitários
- **Prettier** - Formatador de código

### **Arquitetura e Padrões**
- **Standalone Components** - Componentes independentes sem NgModules
- **Signal-based Change Detection** - Detecção de mudanças otimizada
- **HTTP Interceptors** - Interceptação e manipulação de requisições HTTP
- **Reactive Forms** - Formulários reativos para melhor UX

## ✨ Funcionalidades Principais

### 🏠 **Página Inicial**
- Exibição de produtos em destaque
- Produtos com desconto
- Diferenciais da empresa
- Feedbacks de clientes
- Navegação responsiva

### 🔐 **Sistema de Autenticação**
- Login de usuários
- Cadastro de novos usuários
- Recuperação de senha
- Interceptor HTTP para tokens JWT
- Gerenciamento de sessão

### 🛍️ **Gerenciamento de Produtos**
- Visualização detalhada de produtos
- Listagem de todos os produtos
- Produtos em destaque
- Produtos com desconto
- Busca e filtros

### 🛒 **Sistema de Carrinhos**
- Adição de produtos ao carrinho
- Visualização do carrinho atual
- Histórico de carrinhos
- Detalhes de carrinhos específicos

### 💳 **Processo de Pagamento**
- Início do processo de pagamento
- Redirecionamento para whatsapp
- Confirmação aguardo de confirmaçao de pagamento do vendedor

### 👨‍💼 **Painel Administrativo**
- **Gerenciamento de Usuários**: CRUD completo de usuários
- **Gerenciamento de Produtos**: Adição, edição e remoção de produtos
- **Gerenciamento de Categorias**: Organização hierárquica de produtos
- **Gerenciamento de Feedbacks**: Moderação de comentários de clientes
- **Gerenciamento de Carrinhos**: Acompanhamento de vendas e pedidos

### 👤 **Área do Usuário**
- Perfil personalizado
- Histórico de compras
- Configurações da conta
- Gerenciamento de dados pessoais

## 📋 Pré-requisitos para Execução Local

### **Sistema Operacional**
- Windows 10/11, macOS 10.15+ ou Linux (Ubuntu 18.04+)

### **Software Necessário**
- **Node.js 18.0.0** ou superior
- **npm 9.0.0** ou superior (ou **yarn 1.22.0**+)
- **Git** para clonagem do repositório

### **Navegadores Suportados**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚀 Como Rodar o Projeto

### **1. Clone o Repositório**
```bash
git clone https://github.com/seu-usuario/commerce-mail.git
cd commerce-mail
```

### **2. Instale as Dependências**
```bash
npm install
# ou
yarn install
```

### **3. Execute o Projeto em Modo de Desenvolvimento**
```bash
npm start
# ou
ng serve
```

### **4. Acesse a Aplicação**
Abra seu navegador e acesse: `http://localhost:4200`

### **5. Build para Produção**
```bash
npm run build
# ou
ng build
```

## ⚙️ Configuração

### **Configuração do Angular**
O projeto utiliza as seguintes configurações padrão:
- **Porta**: 4200 (configurável via `ng serve --port 4201`)
- **Host**: localhost (configurável via `ng serve --host 0.0.0.0`)
- **Open**: false (não abre automaticamente o navegador)

## 🔗 Estrutura da Aplicação

### **Rotas Principais**
```
/                           → Página inicial
/login                      → Autenticação de usuário
/sign-up                    → Cadastro de novo usuário
/product/:id                → Detalhes do produto
/cart                       → Carrinho de compras
/all-carts/:id             → Histórico de carrinhos
/account/:id                → Área do usuário
/start-payment/:id          → Início do pagamento
/reset-password             → Recuperação de senha
/admin                      → Painel administrativo
```

### **Componentes Principais**
- **Header**: Navegação principal e autenticação
- **Footer**: Informações da empresa e links úteis
- **Product Components**: Exibição e gerenciamento de produtos
- **Cart Components**: Sistema de carrinhos de compra
- **Admin Components**: Painel administrativo completo
- **Auth Components**: Sistema de autenticação

## 📱 Responsividade

O projeto é totalmente responsivo e otimizado para:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

## 🔒 Segurança

- **Interceptors HTTP**: Autenticação automática via tokens JWT
- **Validação de Formulários**: Validação client-side e server-side
- **Sanitização de Dados**: Prevenção contra XSS e injeção de código
- **Gerenciamento de Sessão**: Controle seguro de autenticação

## 📊 Performance

- **Lazy Loading**: Carregamento sob demanda de módulos
- **Change Detection**: Detecção de mudanças otimizada
- **Bundle Optimization**: Build otimizado para produção
- **Image Optimization**: Compressão e otimização de imagens

## 🤝 Como Contribuir

### **1. Fork do Projeto**
Faça um fork do projeto para sua conta GitHub.

### **2. Clone do Fork**
```bash
git clone https://github.com/seu-usuario/commerce-mail.git
cd commerce-mail
```

### **3. Crie uma Branch**
```bash
git checkout -b feature/nova-funcionalidade
# ou
git checkout -b fix/correcao-bug
```

### **4. Faça as Alterações**
- Implemente suas funcionalidades
- Adicione testes quando apropriado
- Mantenha o código limpo e bem documentado

### **5. Commit das Alterações**
```bash
git add .
git commit -m "feat: Adiciona nova funcionalidade de busca avançada"
```

### **6. Push para o Fork**
```bash
git push origin feature/nova-funcionalidade
```

### **7. Abra um Pull Request**
- Vá para o repositório original
- Clique em "New Pull Request"
- Selecione sua branch
- Descreva as alterações realizadas

### **Padrões de Commit**
Utilizamos o padrão [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` para novas funcionalidades
- `fix:` para correções de bugs
- `docs:` para documentação
- `style:` para formatação de código
- `refactor:` para refatoração
- `test:` para testes
- `chore:` para tarefas de manutenção

## 🐛 Reportando Bugs

Para reportar bugs ou solicitar novas funcionalidades:

1. **Verifique se já existe uma issue** relacionada
2. **Crie uma nova issue** com:
   - Descrição clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs. atual
   - Screenshots (se aplicável)
   - Informações do ambiente (navegador, OS, versão)

## 📚 Documentação Adicional

- **Angular Documentation**: [angular.io](https://angular.io/docs)
- **TypeScript Handbook**: [typescriptlang.org](https://www.typescriptlang.org/docs)
- **RxJS Documentation**: [rxjs.dev](https://rxjs.dev/guide/overview)

## 👨‍💻 Autor

**Leo** 🚀

- **GitHub**: [@seu-usuario](https://github.com/seu-usuario)
- **LinkedIn**: [Seu Nome](https://linkedin.com/in/seu-perfil)
- **Email**: seu-email@exemplo.com


**⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!**
