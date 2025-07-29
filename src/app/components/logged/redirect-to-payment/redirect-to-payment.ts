import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CartService, CartResponse } from '../../../service/cart-requisition';
import { UserService } from '../../../service/user-requisition';

@Component({
  selector: 'app-redirect-to-payment',
  imports: [CommonModule],
  templateUrl: './redirect-to-payment.html',
  styleUrl: './redirect-to-payment.css'
})
export class RedirectToPayment implements OnInit {
  isLoading: boolean = true;
  errorMessage: string = '';
  cartMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUserCart();
  }

  loadUserCart(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    
    if (!userId) {
      this.errorMessage = 'ID do usuário não encontrado';
      this.isLoading = false;
      return;
    }

    // Busca o carrinho aberto do usuário
    this.cartService.findOpenCartByUser(parseInt(userId)).subscribe({
      next: (cart: CartResponse) => {
        this.cartMessage = this.cartService.formatCartMessage(cart);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar carrinho:', error);
        this.errorMessage = 'Erro ao carregar carrinho. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  redirectToWhatsApp(): void {
    if (this.cartMessage) {
      const encodedMessage = encodeURIComponent(this.cartMessage);
      const whatsappUrl = `https://wa.me/5511944636254?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
    }
  }
}
