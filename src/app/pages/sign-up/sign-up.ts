import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Footer } from '../../components/public/footer/footer';
import { Header } from '../../components/not-logged/header/header';
import { SignUp as SignUpComponent } from '../../components/not-logged/sign-up/sign-up';
import { UserService } from '../../service/user-requisition';

@Component({
  selector: 'app-sign-up-page',
  imports: [
    CommonModule,
    Header,
    Footer,
    SignUpComponent
  ],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
})
export class SignUp implements OnInit {

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
