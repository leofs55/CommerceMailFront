import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService, CartResponse } from '../../../../service/cart-requisition';

@Component({
  selector: 'app-carts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carts.html',
  styleUrl: './carts.css'
})
export class Carts implements OnInit {
  carts: CartResponse[] = [];
  filteredCarts: CartResponse[] = [];
  searchId: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadAllCarts();
  }

  loadAllCarts(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.cartService.findAllCarts().subscribe({
      next: (carts) => {
        this.carts = carts;
        this.filteredCarts = carts;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar carrinhos: ' + error.message;
        this.isLoading = false;
      }
    });
  }

  searchCartsById(): void {
    if (!this.searchId.trim()) {
      this.filteredCarts = this.carts;
      return;
    }

    this.filteredCarts = this.carts.filter(cart => 
      cart.id.toLowerCase().includes(this.searchId.toLowerCase())
    );
  }

  clearSearch(): void {
    this.searchId = '';
    this.filteredCarts = this.carts;
  }

  // Métodos para os botões (sem implementação por enquanto)
  deleteCart(cartId: string): void {
    console.log('Deletar carrinho:', cartId);
    // TODO: Implementar lógica de deletar
  }

  editCart(cartId: string): void {
    console.log('Editar carrinho:', cartId);
    // TODO: Implementar lógica de editar
  }

  closeCart(cartId: string): void {
    console.log('Fechar carrinho:', cartId);
    // TODO: Implementar lógica de fechar
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'status-open';
      case 'closed':
        return 'status-closed';
      case 'pending':
        return 'status-pending';
      default:
        return 'status-default';
    }
  }
}
