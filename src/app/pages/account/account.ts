import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../components/not-logged/header/header';
import { HeaderLogged } from '../../components/logged/header/header';
import { Footer } from '../../components/public/footer/footer';
import { UserService } from '../../service/user-requisition';
import { Account as AccountComponent } from '../../components/logged/account/account';

@Component({
  selector: 'app-account',
  imports: [
    CommonModule,
    Header,
    AccountComponent,
    HeaderLogged,
    Footer
  ],
  templateUrl: './account.html',
  styleUrl: './account.css'
})
export class Account implements OnInit {
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
