import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../service/product-requisition';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-discounted',
  imports: [CommonModule],
  templateUrl: './products-discounted.html',
  styleUrl: './products-discounted.css'
})
export class ProductsDiscounted {
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
