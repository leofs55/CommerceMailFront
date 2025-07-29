import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../service/product-requisition';
import { UserService } from '../../service/user-requisition';
import { Footer } from '../../components/public/footer/footer';
import { Header } from '../../components/not-logged/header/header';
import { HeaderLogged } from '../../components/logged/header/header';
import { ProductDetails as ProductDetailsComponent } from '../../components/public/product-details/product-details';

@Component({
  selector: 'app-product-details-page',
  imports: [
    CommonModule,
    Header,
    HeaderLogged,
    ProductDetailsComponent,
    Footer,
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {
  isLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private userService: UserService
  ) {}

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
