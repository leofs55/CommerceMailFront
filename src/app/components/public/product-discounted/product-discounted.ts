import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../service/product-requisition';
import { Router } from '@angular/router';
import { CartService } from '../../../service/cart-requisition';
import { UserService } from '../../../service/user-requisition';

@Component({
  selector: 'app-product-discounted',
  imports: [CommonModule],
  templateUrl: './product-discounted.html',
  styleUrl: './product-discounted.css'
})
export class ProductDiscounted {
  product: any;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productService.getProductById(5)
      .subscribe(data => {
        this.product = data;
      });
  }

  addToCart() {
    // Verificar se o usuário está logado
    if (!this.userService.isLoggedIn()) {
      // Se não estiver logado, redirecionar para a página de login
      this.router.navigate(['/login']);
      return;
    }

    // Se estiver logado, adicionar ao carrinho e redirecionar
    if (this.product) {
      this.cartService.addToCart(this.product, 1);
      this.router.navigate(['/cart']);
    }
  }

  buyNow() {
    // Verificar se o usuário está logado
    if (!this.userService.isLoggedIn()) {
      // Se não estiver logado, redirecionar para a página de login
      this.router.navigate(['/login']);
      return;
    }

    // Se estiver logado, adicionar ao carrinho e redirecionar
    if (this.product) {
      this.cartService.addToCart(this.product, 1);
      this.router.navigate(['/cart']);
    }
  }

  goToProductDetails(id: number) {
    this.router.navigate(['/product', id]);
  }
}