import { Component } from '@angular/core';
import { Header } from '../../components/not-logged/header/header';
import { Footer } from '../../components/public/footer/footer';
import { CreateNewPassword as CreateNewPasswordComponent } from '../../components/public/create-new-password/create-new-password';

@Component({
  selector: 'app-create-new-password',
  imports: [
    Header,
    Footer,
    CreateNewPasswordComponent
  ],
  templateUrl: './create-new-password.html',
  styleUrl: './create-new-password.css'
})
export class CreateNewPassword {

}
