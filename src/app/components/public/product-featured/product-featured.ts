import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../service/product-requisition';  
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-product-featured',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-featured.html',
  styleUrl: './product-featured.css'
})
export class ProductFeatured {
  product: any;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProductById(1)
      .subscribe(data => {
        this.product = data;
      });
  }
}
