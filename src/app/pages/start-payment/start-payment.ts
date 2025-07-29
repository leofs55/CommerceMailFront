import { Component, OnInit } from '@angular/core';
import { Footer } from '../../components/public/footer/footer';
import { Header } from '../../components/not-logged/header/header';
import { HeaderLogged } from '../../components/logged/header/header';
import { CommonModule } from '@angular/common';
import { UserService } from '../../service/user-requisition';
import { ActivatedRoute } from '@angular/router';
import { CartService, CartResponse } from '../../service/cart-requisition';

@Component({
  selector: 'app-start-payment',
  imports: [
    CommonModule,
    Header,
    HeaderLogged,
    Footer,
  ],
  templateUrl: './start-payment.html',
  styleUrl: './start-payment.css'
})
export class StartPayment implements OnInit {
  isLoggedIn = false;
  isLoading: boolean = true;
  errorMessage: string = '';
  cartMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    // Verificar status de autenticação ao inicializar
    this.checkAuthStatus();
    
    // Escutar mudanças no status de autenticação
    this.userService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });

    // Carregar carrinho do usuário
    this.loadUserCart();
  }

  private checkAuthStatus() {
    this.isLoggedIn = this.userService.isLoggedIn();
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
