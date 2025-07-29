import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../components/not-logged/header/header';
import { HeaderLogged } from '../../components/logged/header/header';
import { Footer } from '../../components/public/footer/footer';
import { UserService } from '../../service/user-requisition';
import { Cart as CartComponent } from '../../components/logged/cart/cart';  

@Component({
  selector: 'app-cart',
  imports: [
    CommonModule,
    Header,
    CartComponent,
    HeaderLogged,
    Footer
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
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
