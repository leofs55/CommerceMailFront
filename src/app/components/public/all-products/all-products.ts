import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../service/product-requisition';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-all-products',
  imports: [CommonModule],
  templateUrl: './all-products.html',
  styleUrl: './all-products.css'
})

export class AllProducts implements OnInit {
  products: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getAllProducts()
      .subscribe(data => {
        this.products = data;
      });
  }
}
