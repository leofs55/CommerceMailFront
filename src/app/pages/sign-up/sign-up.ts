import { Component } from '@angular/core';
import { Footer } from '../../components/public/footer/footer';
import { Header } from '../../components/not-logged/header/header';
import { SignUp as SignUpComponent } from '../../components/not-logged/sign-up/sign-up';

@Component({
  selector: 'app-sign-up-page',
  imports: [
    Header,
    Footer,
    SignUpComponent
  ],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
})
export class SignUp {

}
