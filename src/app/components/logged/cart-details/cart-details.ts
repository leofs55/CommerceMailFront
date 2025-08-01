import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService, CartResponse, ProductResponse } from '../../../service/cart-requisition';
import { UserService } from '../../../service/user-requisition';

@Component({
  selector: 'app-cart-details-component',
  imports: [CommonModule],
  templateUrl: './cart-details.html',
  styleUrl: './cart-details.css'
})
export class CartDetails implements OnInit {
  cart: CartResponse | null = null;
  loading: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';
  cartMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    console.log('CartDetails component initialized');
    this.loadCartDetails();
  }

  loadCartDetails(): void {
    const cartId = this.route.snapshot.paramMap.get('id');
    console.log('ID do carrinho recebido na URL:', cartId);
    
    if (!cartId) {
      this.errorMessage = 'ID do carrinho não encontrado na URL';
      this.loading = false;
      return;
    }

    console.log('Buscando carrinho com ID:', cartId);
    this.cartService.findCartById(cartId).subscribe({
      next: (cart: CartResponse) => {
        this.cart = cart;
        this.cartMessage = this.cartService.formatCartMessage(cart);
        this.loading = false;
        this.errorMessage = '';
      },
      error: (error: any) => {
        console.error('Erro ao carregar detalhes do carrinho:', error);
        this.errorMessage = 'Erro ao carregar detalhes do carrinho. Tente novamente.';
        this.loading = false;
      }
    });
  }

  redirectToWhatsApp(): void {
    if (this.cartMessage) {
      const encodedMessage = encodeURIComponent(this.cartMessage);
      const whatsappUrl = `https://wa.me/5511944636254?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
      this.successMessage = 'Redirecionando para WhatsApp...';
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    }
  }

  isCartOpen(): boolean {
    return this.cart?.status === 'OPEN';
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'open':
        return '#48bb78'; // Verde
      case 'sold':
        return '#1c8546'; // Vermelho
      default:
        return '#718096'; // Cinza
    }
  }

  getStatusText(status: string): string {
    switch (status.toLowerCase()) {
      case 'open':
        return 'Aberto';
      case 'sold':
        return 'Concluído';
      default:
        return status;
    }
  }
  
  getStatusClass(): string {
    switch (this.cart?.status) {
      case 'OPEN':
        return 'status-open';
      case 'CLOSED':
        return 'status-closed';
      case 'PENDING':
        return 'status-pending';
      default:
        return 'status-unknown';
    }
  }

  formatPrice(price: number): string {
    return `R$ ${parseFloat(price.toString()).toFixed(2)}`;
  }

  goBack(): void {
    const userId = this.cart?.user.id;
    console.log('Voltando para lista de carrinhos do usuário:', userId);
    console.log('URL de destino:', `/all-carts/${userId}`);
    this.router.navigate(['/all-carts', userId || '']);
  }
}
