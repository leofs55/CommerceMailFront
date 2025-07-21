import { Component } from '@angular/core';
import { Header } from '../../components/not-logged/header/header';
import { Footer } from '../../components/public/footer/footer';
import { Login as LoginComponent } from '../../components/not-logged/login/login';

@Component({
  selector: 'app-login-page',
  imports: [
    Header,
    Footer,
    LoginComponent
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

}
