import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../service/product-requisition';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-featured',
  imports: [CommonModule],
  templateUrl: './products-featured.html',
  styleUrls: ['./products-featured.css']
})
export class ProductsFeatured implements OnInit {
  featuredProducts: any[] = [];

  constructor(private productService: ProductService) {}

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
}
