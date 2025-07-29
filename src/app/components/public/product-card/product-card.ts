import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, ProductResponse } from '../../../service/cart-requisition';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard {
  @Input() product!: ProductResponse;
  @Output() addToCartEvent = new EventEmitter<ProductResponse>();

  constructor(private cartService: CartService) {}

  addToCart(): void {
    this.cartService.addToCart(this.product, 1);
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
