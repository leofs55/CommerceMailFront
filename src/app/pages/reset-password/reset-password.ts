import { Component } from '@angular/core';
import { Header } from '../../components/not-logged/header/header';
import { Footer } from '../../components/public/footer/footer';
import { ResetPassword as ResetPasswordComponent } from '../../components/public/reset-password/reset-password';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [Header, Footer, ResetPasswordComponent, RouterModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {

}
