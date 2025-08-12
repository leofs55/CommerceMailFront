import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, firstValueFrom } from 'rxjs';

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
  imgUrl?: string;
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
    console.log('addToCart chamado:', { product, quantity });
    const currentItems = this.cartItemsSubject.value;
    console.log('Items atuais:', currentItems);
    
    const existingItem = currentItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      console.log('Item existente encontrado, aumentando quantidade');
      existingItem.quantity += quantity;
    } else {
      console.log('Novo item, adicionando ao carrinho');
      currentItems.push({ product, quantity });
    }
    
    console.log('Items após adição:', currentItems);
    this.updateCart(currentItems);
  }

  // Método para adicionar produtos verificando carrinho existente
  async addToCartWithExistingCheck(product: ProductResponse, quantity: number = 1, userId?: number): Promise<void> {
    console.log('addToCartWithExistingCheck chamado:', { product, quantity, userId });
    
    // Se não temos userId, adiciona normalmente ao carrinho local
    if (!userId) {
      console.log('Sem userId, adicionando ao carrinho local');
      this.addToCart(product, quantity);
      return;
    }

    try {
      console.log('Verificando carrinho existente para userId:', userId);
      // Verifica se há carrinho aberto
      const existingCart = await firstValueFrom(this.findOpenCartByUser(userId));
      
      if (existingCart) {
        console.log('Carrinho existente encontrado, adicionando ao carrinho local');
        // Se há carrinho existente, adiciona ao carrinho local também
        // para manter sincronização
        this.addToCart(product, quantity);
      } else {
        console.log('Nenhum carrinho existente, adicionando ao carrinho local');
        // Se não há carrinho existente, adiciona normalmente
        this.addToCart(product, quantity);
      }
    } catch (error: any) {
      console.log('Erro ao verificar carrinho existente:', error);
      // Se erro 404 (não encontrou carrinho), adiciona normalmente
      if (error.status === 404) {
        console.log('Erro 404 - adicionando ao carrinho local');
        this.addToCart(product, quantity);
      } else {
        // Para outros erros, adiciona normalmente também
        console.log('Outro erro - adicionando ao carrinho local');
        this.addToCart(product, quantity);
      }
    }
  }

  // Função para formatar carrinho em mensagem
  formatCartMessage(cart: CartResponse): string {
    let message = `*Novo Pedido - Detalhes do Carrinho*\n\n`;

    message += `*Carrinho ID:* ${cart.id}\n`;
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
    console.log('updateCart chamado com items:', items);
    this.cartItemsSubject.next(items);
    this.storeCart(items);
    console.log('Carrinho atualizado e armazenado');
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

  // GET /api/v1/cart/all - Busca todos os carrinhos para adm
  findAllCarts(): Observable<CartResponse[]> {
    return this.http.get<CartResponse[]>(`${this.apiUrl}/all`);
  }

  // PUT /api/v1/cart/sold/{cartId} - Atualiza carrinho para vendido
  updateToSoldCartById(cartId: string): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.apiUrl}/sold/${cartId}`);
  }
}