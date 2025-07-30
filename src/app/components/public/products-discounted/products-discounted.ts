import { Component } from '@angular/core';
import { ProductService } from '../../../service/product-requisition';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../service/cart-requisition';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-discounted',
  imports: [CommonModule],
  templateUrl: './products-discounted.html',
  styleUrl: './products-discounted.css'
})
export class ProductsDiscounted {
  product1: any;
  product2: any;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productService.getProductById(5)
      .subscribe(data => {
        this.product1 = data;
      });
    this.productService.getProductById(6)
      .subscribe(data => {
        this.product2 = data;
      });
  }

  addToCart(product: any) {
    if (product) {
      this.cartService.addToCart(product, 1);
      this.router.navigate(['/cart']);
    }
  }

  buyNow(product: any) {
    if (product) {
      this.cartService.addToCart(product, 1);
      this.router.navigate(['/cart']);
    }
  }
}
