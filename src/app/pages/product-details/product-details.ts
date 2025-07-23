import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../service/product-requisition';
import { Footer } from '../../components/public/footer/footer';
import { Header } from '../../components/not-logged/header/header';

@Component({
  selector: 'app-product-details',
  imports: [
    Header,
    Footer,
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {
  productId: string | null = null;
  product: any;

  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productService.getProductById(Number(id)).subscribe(produto => {
          this.product = produto;
        });
      }
    });
  }
}
