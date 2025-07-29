import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../service/product-requisition';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-discounted',
  imports: [CommonModule],
  templateUrl: './product-discounted.html',
  styleUrl: './product-discounted.css'
})
export class ProductDiscounted {
  product: any;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.productService.getProductById(5)
      .subscribe(data => {
        this.product = data;
      });
  }

  goToProductDetails(id: number) {
    this.router.navigate(['/product', id]);
  }
}