# 📝 Exemplo de Uso das Funções do Carrinho

## 🎯 Funções Criadas

### 1. `addProductFromUrl(route: ActivatedRoute, quantity: number)`
Adiciona produto ao carrinho pegando o ID da URL e quantidade especificada.

### 2. `addProductById(productId: number, quantity: number)`
Adiciona produto ao carrinho usando ID específico e quantidade.

## 🔧 Como Usar

### Exemplo 1: Adicionar produto da URL

```typescript
// No componente de detalhes do produto
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../service/cart-requisition';

@Component({
  selector: 'app-product-details',
  template: `
    <div>
      <h2>Detalhes do Produto</h2>
      <button (click)="addToCart(1)">Adicionar 1 ao Carrinho</button>
      <button (click)="addToCart(2)">Adicionar 2 ao Carrinho</button>
      <button (click)="addToCart(5)">Adicionar 5 ao Carrinho</button>
    </div>
  `
})
export class ProductDetailsComponent implements OnInit {
  
  constructor(
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Carregar detalhes do produto
  }

  addToCart(quantity: number): void {
    this.cartService.addProductFromUrl(this.route, quantity).subscribe({
      next: (success) => {
        if (success) {
          alert('Produto adicionado ao carrinho com sucesso!');
        } else {
          alert('Erro ao adicionar produto ao carrinho');
        }
      },
      error: (error) => {
        console.error('Erro:', error);
        alert('Erro ao adicionar produto ao carrinho');
      }
    });
  }
}
```

### Exemplo 2: Adicionar produto por ID específico

```typescript
// Em qualquer componente
import { Component } from '@angular/core';
import { CartService } from '../service/cart-requisition';

@Component({
  selector: 'app-quick-add',
  template: `
    <div>
      <input #productId type="number" placeholder="ID do Produto">
      <input #quantity type="number" placeholder="Quantidade" value="1">
      <button (click)="addProduct(productId.value, quantity.value)">
        Adicionar ao Carrinho
      </button>
    </div>
  `
})
export class QuickAddComponent {
  
  constructor(private cartService: CartService) {}

  addProduct(productId: string, quantity: string): void {
    const id = parseInt(productId);
    const qty = parseInt(quantity) || 1;

    this.cartService.addProductById(id, qty).subscribe({
      next: (success) => {
        if (success) {
          alert('Produto adicionado ao carrinho!');
        } else {
          alert('Erro ao adicionar produto');
        }
      },
      error: (error) => {
        console.error('Erro:', error);
        alert('Erro ao adicionar produto');
      }
    });
  }
}
```

### Exemplo 3: Integração com ProductService real

```typescript
// Modificar a função getProductById no CartService para usar ProductService real
import { ProductService } from './product-requisition';

export class CartService {
  constructor(
    private http: HttpClient,
    private productService: ProductService // Adicionar ProductService
  ) {}

  // Substituir a função getProductById simulada por uma real
  private getProductById(productId: number): Observable<ProductResponse | null> {
    return this.productService.getProductById(productId).pipe(
      map(product => {
        if (product) {
          return {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: product.stock || 0
          } as ProductResponse;
        }
        return null;
      }),
      catchError(error => {
        console.error('Erro ao buscar produto:', error);
        return of(null);
      })
    );
  }
}
```

## 🛣️ Rotas Necessárias

Para usar `addProductFromUrl`, certifique-se de que sua rota tenha o parâmetro `id`:

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: 'product/:id', component: ProductDetailsComponent },
  { path: 'add-to-cart/:id', component: AddToCartComponent },
  // ... outras rotas
];
```

## 📱 Exemplo de URL

```
http://localhost:4200/product/123
http://localhost:4200/add-to-cart/456
```

## 🔄 Fluxo de Funcionamento

1. **Usuário acessa URL** com ID do produto
2. **Função extrai ID** da URL usando `ActivatedRoute`
3. **Busca dados do produto** pelo ID
4. **Adiciona ao carrinho** com quantidade especificada
5. **Retorna sucesso/erro** via Observable

## ⚠️ Observações Importantes

1. **ProductService**: A função `getProductById` está simulada. Integre com seu `ProductService` real.

2. **Tratamento de Erros**: As funções incluem tratamento de erros e validações.

3. **Observable**: As funções retornam `Observable<boolean>` para feedback.

4. **Logs**: Console logs para debug estão incluídos.

5. **Validação**: IDs inválidos são tratados adequadamente.

## 🎨 Personalização

Você pode personalizar:
- Mensagens de feedback
- Validações adicionais
- Integração com outros serviços
- Comportamento em caso de erro
- Interface do usuário 