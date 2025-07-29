import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

// Interfaces para as requisições
export interface CartCreateProductRequest {
  id: number;
  quantity: number;
}

export interface CartCreateRequest {
  products: CartCreateProductRequest[];
  userId: number;
  status: string;
}

export interface CartUpdateRequest {
  products: CartCreateProductRequest[];
  userId: number;
}

// Interfaces para as respostas
export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  quantity: number;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface CartCreateResponse {
  productResponses: ProductResponse[];
  totalPrice: number;
  user: UserResponse;
  status: string;
}

export interface CartResponse {
  id: string;
  productResponses: ProductResponse[];
  totalPrice: number;
  user: UserResponse;
  status: string;
}

export interface CartUpdateResponse {
  productResponses: ProductResponse[];
  totalPrice: number;
  user: UserResponse;
  status: string;
}

// Interface para item do carrinho local
export interface CartItem {
  product: ProductResponse;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'http://localhost:8080/api/v1/cart';
  private cartKey = 'local_cart';
  
  // BehaviorSubject para gerenciar o carrinho local
  private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.getStoredCart());
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Métodos para gerenciar carrinho local
  addToCart(product: ProductResponse, quantity: number = 1): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentItems.push({ product, quantity });
    }
    
    this.updateCart(currentItems);
  }

  // Função para formatar carrinho em mensagem
  formatCartMessage(cart: CartResponse): string {
    let message = `*Novo Pedido - Detalhes do Carrinho*\n\n`;

    message += `*Cliente:* ${cart.user.name}\n`;
    message += `*Email:* ${cart.user.email}\n\n`;

    message += `*Itens do Pedido:*\n`;
    cart.productResponses.forEach((product: ProductResponse, index: number) => {
      message += `${index + 1}. *${product.name}*\n`;
      message += `   - Quantidade: ${product.quantity}\n`;
      message += `   - Preço Unitário: R$ ${parseFloat(product.price.toString()).toFixed(2)}\n`;
      message += `\n`;
    });

    message += `*Total do Pedido: R$ ${parseFloat(cart.totalPrice.toString()).toFixed(2)}*\n`;
    message += `*Status: ${cart.status}*`;

    return message;
  }

  sendCartToSeller(userId: number): void {
    this.findOpenCartByUser(userId).subscribe((cart: CartResponse) => {
      const message = this.formatCartMessage(cart);
      console.log(message);
      // Aqui você pode implementar o envio da mensagem para o vendedor
    });
  }

  removeFromCart(productId: number): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.filter(item => item.product.id !== productId);
    this.updateCart(updatedItems);
  }

  updateQuantity(productId: number, quantity: number): void {
    const currentItems = this.cartItemsSubject.value;
    const item = currentItems.find(item => item.product.id === productId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.updateCart(currentItems);
      }
    }
  }

  clearCart(): void {
    this.updateCart([]);
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  getCartTotal(): number {
    return this.cartItemsSubject.value.reduce((total, item) => {
      const price = item.product.price;
      return total + (price * item.quantity);
    }, 0);
  }

  getCartItemCount(): number {
    return this.cartItemsSubject.value.reduce((count, item) => count + item.quantity, 0);
  }

  private updateCart(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
    this.storeCart(items);
  }

  private getStoredCart(): CartItem[] {
    const cartData = localStorage.getItem(this.cartKey);
    return cartData ? JSON.parse(cartData) : [];
  }

  private storeCart(items: CartItem[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(items));
  }

  // Converter carrinho local para CartCreateRequest
  createCartRequest(userId: number): CartCreateRequest {
    const items = this.getCartItems();
    const products: CartCreateProductRequest[] = items.map(item => ({
      id: item.product.id,
      quantity: item.quantity
    }));

    return {
      products,
      userId,
      status: 'OPEN'
    };
  }

  // Métodos da API
  // POST /api/v1/cart/create
  createCart(cartCreateRequest: CartCreateRequest): Observable<CartCreateResponse> {
    return this.http.post<CartCreateResponse>(`${this.apiUrl}/create`, cartCreateRequest);
  }

  // GET /api/v1/cart/all/{userId}
  findAllCartByUser(userId: number): Observable<CartResponse[]> {
    return this.http.get<CartResponse[]>(`${this.apiUrl}/all/${userId}`);
  }

  // PUT /api/v1/cart/update/{id}
  updateCartApi(id: string, cartUpdateRequest: CartUpdateRequest): Observable<CartUpdateResponse> {
    return this.http.put<CartUpdateResponse>(`${this.apiUrl}/update/${id}`, cartUpdateRequest);
  }

  // GET /api/v1/cart/{id}
  findCartById(id: string): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.apiUrl}/${id}`);
  }

  // GET /api/v1/cart/cart-open/{userId} - Busca carrinho aberto do usuário
  findOpenCartByUser(userId: number): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.apiUrl}/cart-open/${userId}`);
  }
}