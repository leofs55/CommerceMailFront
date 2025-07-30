import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, ProductResponse } from '../../../service/cart-requisition';
import { UserService } from '../../../service/user-requisition';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard {
  @Input() product!: ProductResponse;
  @Output() addToCartEvent = new EventEmitter<ProductResponse>();

  constructor(
    private cartService: CartService,
    private userService: UserService
  ) {}

  async addToCart(): Promise<void> {
    console.log('ProductCard addToCart chamado com produto:', this.product);
    const currentUser = this.userService.getCurrentUser();
    const userId = currentUser?.id;
    console.log('Usuario atual:', currentUser, 'userId:', userId);
    
    await this.cartService.addToCartWithExistingCheck(this.product, 1, userId);
    this.addToCartEvent.emit(this.product);
    
    // Feedback visual (opcional)
    this.showAddToCartFeedback();
  }

  private showAddToCartFeedback(): void {
    // Aqui você pode implementar um toast ou notificação
    console.log(`Produto "${this.product.name}" adicionado ao carrinho!`);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  getProductPrice(): number {
    return this.product.price;
  }
}
