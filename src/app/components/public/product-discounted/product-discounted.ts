import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../service/product-requisition';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-discounted',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-discounted.html',
  styleUrl: './product-discounted.css'
})
export class ProductDiscounted {
  product1: any;
  product2: any;

  constructor(private productService: ProductService) {}

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
}