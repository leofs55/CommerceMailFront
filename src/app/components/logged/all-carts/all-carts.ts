import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService, CartResponse } from '../../../service/cart-requisition';
import { UserService } from '../../../service/user-requisition';
import { catchError } from 'rxjs/operators';
import { throwError, of } from 'rxjs';

@Component({
  selector: 'app-all-carts-component',
  imports: [CommonModule],
  templateUrl: './all-carts.html',
  styleUrl: './all-carts.css'
})
export class AllCarts implements OnInit {
  userId: number | null = null;
  carts: CartResponse[] = [];
  loading: boolean = true;
  error: string = '';
  currentUser: any = null;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private cartService: CartService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.route.params.subscribe(params => {
      this.userId = Number(params['id']);
      if (this.userId) {
        this.loadCarts();
      } else {
        this.error = 'ID do usuário não fornecido';
        this.loading = false;
      }
    });
  }

  loadCurrentUser(): void {
    this.currentUser = this.userService.getCurrentUser();
    if (!this.currentUser) {
      this.error = 'Usuário não está logado';
      this.loading = false;
    }
  }

  loadCarts(): void {
    if (!this.userId) return;

    this.loading = true;
    this.error = '';

    this.cartService.findAllCartByUser(this.userId)
      .pipe(
        catchError((error: any) => {
          console.error('Erro ao carregar carrinhos:', error);
          this.error = 'Erro ao carregar carrinhos';
          this.loading = false;
          return of([]);
        })
      )
      .subscribe((carts: CartResponse[]) => {
        this.carts = carts;
        this.loading = false;
        console.log('Carrinhos carregados:', carts);
      });
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'open':
        return '#48bb78'; // Verde
      case 'closed':
        return '#e53e3e'; // Vermelho
      case 'pending':
        return '#ed8936'; // Laranja
      case 'completed':
        return '#3182ce'; // Azul
      default:
        return '#718096'; // Cinza
    }
  }

  getStatusText(status: string): string {
    switch (status.toLowerCase()) {
      case 'open':
        return 'Aberto';
      case 'closed':
        return 'Fechado';
      case 'pending':
        return 'Pendente';
      case 'completed':
        return 'Concluído';
      default:
        return status;
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  viewCartDetails(cartId: string): void {
    // Futuramente implementar navegação para detalhes do carrinho
    console.log('Visualizar detalhes do carrinho:', cartId);
    // this.router.navigate(['/cart-details', cartId]);
  }

  getTotalItems(cart: CartResponse): number {
    return cart.productResponses.reduce((total, product) => total + product.quantity, 0);
  }

  getUniqueProducts(cart: CartResponse): number {
    return cart.productResponses.length;
  }
}
