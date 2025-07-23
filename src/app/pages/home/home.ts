import { Component } from '@angular/core';
import { Header } from '../../components/not-logged/header/header';
import { Footer } from '../../components/public/footer/footer';
import { ProductFeatured } from '../../components/public/product-featured/product-featured';
import { CompanyDifferentiators } from '../../components/public/company-differentiators/company-differentiators';
import { ProductsFeatured } from '../../components/public/products-featured/products-featured';
import { ProductDiscounted } from '../../components/public/product-discounted/product-discounted';
import { AllProducts } from '../../components/public/all-products/all-products';
import { ClientsFeedbacks } from '../../components/public/clients-feedbacks/clients-feedbacks';

@Component({
  selector: 'app-home',
  imports: [
    Header,
    Footer,
    ProductFeatured,
    CompanyDifferentiators,
    ProductsFeatured,
    ProductDiscounted,
    AllProducts,
    ClientsFeedbacks
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
