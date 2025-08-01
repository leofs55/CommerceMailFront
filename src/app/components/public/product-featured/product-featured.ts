import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../../service/product-requisition';
import { CartService } from '../../../service/cart-requisition';
import { UserService } from '../../../service/user-requisition';

@Component({
  selector: 'app-product-featured',
  imports: [CommonModule],
  templateUrl: './product-featured.html',
  styleUrl: './product-featured.css'
})
export class ProductFeatured {
  product: any;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productService.getProductById(1)
      .subscribe(data => {
        console.log('Produto carregado:', data);
        this.product = data;
      });
  }

  addToCart() {
    console.log('addToCart chamado');
    
    // Verificar se o usuário está logado
    if (!this.userService.isLoggedIn()) {
      // Se não estiver logado, redirecionar para a página de login
      this.router.navigate(['/login']);
      return;
    }

    // Se estiver logado, adicionar ao carrinho e redirecionar
    if (this.product) {
      console.log('Adicionando produto ao carrinho:', this.product);
      this.cartService.addToCart(this.product, 1);
      this.navigateToCart();
    } else {
      console.log('Produto não disponível');
    }
  }

  buyNow() {
    console.log('buyNow chamado');
    
    // Verificar se o usuário está logado
    if (!this.userService.isLoggedIn()) {
      // Se não estiver logado, redirecionar para a página de login
      this.router.navigate(['/login']);
      return;
    }

    // Se estiver logado, adicionar ao carrinho e redirecionar
    if (this.product) {
      console.log('Comprando produto:', this.product);
      this.cartService.addToCart(this.product, 1);
      this.navigateToCart();
    } else {
      console.log('Produto não disponível');
    }
  }

  private navigateToCart() {
    console.log('Navegando para o carrinho');
    this.router.navigate(['/cart']);
  }
}
