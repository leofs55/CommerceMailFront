import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Header } from '../../components/not-logged/header/header';
import { Footer } from '../../components/public/footer/footer';
import { Login as LoginComponent } from '../../components/not-logged/login/login';
import { UserService } from '../../service/user-requisition';

@Component({
  selector: 'app-login-page',
  imports: [
    CommonModule,
    Header,
    Footer,
    LoginComponent
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    // Se o usuário já estiver logado, redirecionar para a home
    if (this.userService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }
}
