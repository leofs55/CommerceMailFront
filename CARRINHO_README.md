# 🛒 Sistema de Carrinho - CommerceMail

## 📋 Visão Geral

O sistema de carrinho foi implementado com funcionalidades completas para adicionar produtos, gerenciar quantidades e salvar no servidor. O carrinho funciona tanto localmente (localStorage) quanto com integração ao backend.

## 🚀 Funcionalidades Implementadas

### ✅ Carrinho Local
- Adicionar produtos ao carrinho
- Remover produtos do carrinho
- Atualizar quantidades
- Calcular total automaticamente
- Persistência no localStorage
- Contador de itens

### ✅ Integração com Backend
- Salvar carrinho no servidor
- Token de autenticação automático
- Validação de usuário logado
- Tratamento de erros

### ✅ Interface Moderna
- Design responsivo
- Feedback visual
- Estados de loading
- Mensagens de sucesso/erro

## 🔧 Como Usar

### 1. Adicionar Produto ao Carrinho

```typescript
// No componente de produto
import { CartService, ProductResponse } from '../service/cart-requisition';

export class ProductComponent {
  constructor(private cartService: CartService) {}

  addToCart(product: ProductResponse): void {
    this.cartService.addToCart(product, 1); // quantidade padrão 1
  }
}
```

### 2. Visualizar Carrinho

```typescript
// No componente do carrinho
import { CartService, CartItem } from '../service/cart-requisition';

export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.cartTotal = this.cartService.getCartTotal();
    });
  }
}
```

### 3. Salvar Carrinho no Servidor

```typescript
async saveCart(): Promise<void> {
  const currentUser = this.userService.getCurrentUser();
  if (!currentUser) return;

  const cartRequest = this.cartService.createCartRequest(currentUser.id);
  await this.cartService.createCart(cartRequest).toPromise();
}
```

## 📁 Estrutura dos Arquivos

```
src/app/
├── service/
│   └── cart-requisition.ts          # Serviço principal do carrinho
├── components/
│   ├── logged/
│   │   └── cart/
│   │       ├── cart.ts              # Componente do carrinho
│   │       ├── cart.html            # Template do carrinho
│   │       └── cart.css             # Estilos do carrinho
│   └── public/
│       └── product-card/
│           ├── product-card.ts      # Componente do produto
│           ├── product-card.html    # Template do produto
│           └── product-card.css     # Estilos do produto
```

## 🔌 Interfaces TypeScript

### CartItem
```typescript
interface CartItem {
  product: ProductResponse;
  quantity: number;
}
```

### ProductResponse
```typescript
interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  imageUrl?: string;
  category?: string;
  stock: number;
  featured: boolean;
  discounted: boolean;
}
```

### CartCreateRequest
```typescript
interface CartCreateRequest {
  products: CartCreateProductRequest[];
  userId: number;
  status: string;
}
```

## 🎨 Componentes Disponíveis

### ProductCard
- Exibe informações do produto
- Botão "Adicionar ao Carrinho"
- Badges de desconto e destaque
- Indicador de estoque

### Cart
- Lista de produtos no carrinho
- Controles de quantidade
- Resumo do pedido
- Botões de ação (limpar, continuar comprando, salvar)

## 🔐 Autenticação

O sistema usa o interceptor de autenticação configurado em `auth.interceptor.ts` que automaticamente adiciona o token JWT em todas as requisições HTTP.

## 💾 Persistência

### LocalStorage
- `local_cart`: Dados do carrinho local
- `auth_token`: Token de autenticação
- `user_data`: Dados do usuário logado

## 🎯 Próximos Passos

1. **Implementar notificações toast** para feedback visual
2. **Adicionar animações** de transição
3. **Implementar cupons de desconto**
4. **Adicionar cálculo de frete**
5. **Criar histórico de carrinhos**

## 🐛 Solução de Problemas

### Erro: "Usuário não está logado"
- Verifique se o usuário fez login
- Confirme se o token está no localStorage

### Erro: "Carrinho está vazio"
- Adicione produtos antes de salvar
- Verifique se os produtos foram adicionados corretamente

### Erro de CORS
- Verifique se o backend está rodando na porta 8080
- Confirme as configurações de CORS no backend

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação do backend ou entre em contato com a equipe de desenvolvimento. 