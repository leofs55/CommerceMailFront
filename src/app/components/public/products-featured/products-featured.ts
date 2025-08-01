import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../service/product-requisition';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../../service/cart-requisition';
import { UserService } from '../../../service/user-requisition';

@Component({
  selector: 'app-products-featured',
  imports: [CommonModule],
  templateUrl: './products-featured.html',
  styleUrls: ['./products-featured.css']
})
export class ProductsFeatured implements OnInit {
  featuredProducts: any[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private userService: UserService,
    private router: Router) {}

  ngOnInit() {
    const ids = [1, 2, 3, 4];
    ids.forEach(id => {
      this.productService.getProductById(id).subscribe(product => {
        if (product) {
          this.featuredProducts.push(product);
        }
      });
    });
  }

  addToCart(product: any) {
    // Verificar se o usuário está logado
    if (!this.userService.isLoggedIn()) {
      // Se não estiver logado, redirecionar para a página de login
      this.router.navigate(['/login']);
      return;
    }

    // Se estiver logado, adicionar ao carrinho e redirecionar
    if (product) {
      this.cartService.addToCart(product, 1);
      this.router.navigate(['/cart']);
    }
  }
}