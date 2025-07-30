import { Component } from '@angular/core';
import { HeaderLogged } from '../../components/logged/header/header';
import { Footer } from '../../components/public/footer/footer';
import { CartDetails as CartDetailsComponent } from '../../components/logged/cart-details/cart-details';

@Component({
  selector: 'app-cart-details',
  imports: [
    HeaderLogged,
    Footer,
    CartDetailsComponent
  ],
  templateUrl: './cart-details.html',
  styleUrl: './cart-details.css'
})
export class CartDetails {

}
