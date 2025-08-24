# CommerceMail

Uma aplicação de e-commerce desenvolvida em Angular para gerenciamento de produtos, carrinhos de compra e sistema de usuários.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18.0.0 ou superior)
- **npm** (gerenciador de pacotes do Node.js)

### Como instalar o Node.js:

1. Acesse [nodejs.org](https://nodejs.org/)
2. Baixe a versão LTS (Long Term Support)
3. Execute o instalador e siga as instruções
4. Verifique a instalação executando no terminal:
   ```bash
   node --version
   npm --version
   ```

## 🚀 Instalação do Angular CLI

Para instalar o Angular CLI globalmente, execute:

```bash
npm install -g @angular/cli
```

Verifique se a instalação foi bem-sucedida:

```bash
ng version
```

## 📥 Instalação do Projeto

1. **Clone o repositório:**
   ```bash
   git clone [URL_DO_SEU_REPOSITORIO]
   cd CommerceMail
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

## 🏃‍♂️ Executando a Aplicação

Para iniciar a aplicação em modo de desenvolvimento:

```bash
npm run start
```

A aplicação estará disponível em: `http://localhost:4200/`

### Outros comandos úteis:

- **Build para produção:**
  ```bash
  npm run build
  ```

- **Executar testes:**
  ```bash
  npm run test
  ```

- **Lint do código:**
  ```bash
  npm run lint
  ```

## 🏗️ Estrutura do Projeto

```
CommerceMail/
├── src/
│   ├── app/
│   │   ├── components/          # Componentes reutilizáveis
│   │   │   ├── logged/         # Componentes para usuários logados
│   │   │   ├── not-logged/     # Componentes para usuários não logados
│   │   │   └── public/         # Componentes públicos
│   │   ├── pages/              # Páginas da aplicação
│   │   └── service/            # Serviços e interceptors
│   ├── assets/                 # Imagens, ícones e recursos estáticos
│   └── styles.css              # Estilos globais
├── angular.json                # Configuração do Angular
└── package.json                # Dependências do projeto
```

## 🛠️ Tecnologias Utilizadas

- **Angular** - Framework principal
- **TypeScript** - Linguagem de programação
- **CSS** - Estilização
- **HTML** - Estrutura das páginas

## 📱 Funcionalidades

- ✅ Sistema de autenticação (login/registro)
- ✅ Gerenciamento de produtos
- ✅ Carrinho de compras
- ✅ Sistema de categorias
- ✅ Painel administrativo
- ✅ Sistema de feedback
- ✅ Gerenciamento de usuários

## 🔧 Desenvolvimento

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique se todas as dependências estão instaladas
2. Certifique-se de estar usando a versão correta do Node.js
3. Execute `npm cache clean --force` se houver problemas de dependências
4. Abra uma issue no repositório
-

**Desenvolvido com ❤️ usando Angular**
