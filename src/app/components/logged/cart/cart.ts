import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../../service/cart-requisition';
import { UserService } from '../../../service/user-requisition';

@Component({
  selector: 'app-cart-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  cartItemCount: number = 0;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private cartService: CartService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('Cart ngOnInit iniciado');
    
    // Inscreve para mudanças no carrinho local
    this.cartService.cartItems$.subscribe(items => {
      console.log('Cart items atualizados:', items);
      this.cartItems = items;
      this.cartTotal = this.cartService.getCartTotal();
      this.cartItemCount = this.cartService.getCartItemCount();
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  async saveCartToServer(): Promise<void> {
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser) {
      this.errorMessage = 'Usuário não está logado';
      return;
    }

    if (this.cartItems.length === 0) {
      this.errorMessage = 'Carrinho está vazio';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const cartRequest = this.cartService.createCartRequest(currentUser.id);
      await this.cartService.createCart(cartRequest).toPromise();
      
      this.successMessage = 'Carrinho salvo com sucesso!';
      this.cartService.clearCart(); // Limpa o carrinho local após salvar
      
      // Redireciona para a página de pagamento com o ID do usuário
      setTimeout(() => {
        this.router.navigate(['/start-payment', currentUser.id]);
      }, 1500);
    } catch (error: any) {
      this.errorMessage = error.message || 'Erro ao salvar carrinho';
    } finally {
      this.isLoading = false;
    }
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  getProductPrice(product: any): number {
    return product.price;
  }
}
