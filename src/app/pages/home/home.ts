import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../components/not-logged/header/header';
import { HeaderLogged } from '../../components/logged/header/header';
import { Footer } from '../../components/public/footer/footer';
import { ProductFeatured } from '../../components/public/product-featured/product-featured';
import { CompanyDifferentiators } from '../../components/public/company-differentiators/company-differentiators';
import { ProductsFeatured } from '../../components/public/products-featured/products-featured';
import { ProductDiscounted } from '../../components/public/product-discounted/product-discounted';
import { AllProducts } from '../../components/public/all-products/all-products';
import { ClientsFeedbacks } from '../../components/public/clients-feedbacks/clients-feedbacks';
import { ProductsDiscounted } from '../../components/public/products-discounted/products-discounted';
import { UserService } from '../../service/user-requisition';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    Header,
    HeaderLogged,
    Footer,
    ProductFeatured,
    CompanyDifferentiators,
    ProductsDiscounted,
    ProductsFeatured,
    ProductDiscounted,
    AllProducts,
    ClientsFeedbacks
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  isLoggedIn = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    // Verificar status de autenticação ao inicializar
    this.checkAuthStatus();
    
    // Escutar mudanças no status de autenticação
    this.userService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  private checkAuthStatus() {
    this.isLoggedIn = this.userService.isLoggedIn();
  }
}
