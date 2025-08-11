import { Component } from '@angular/core';
import { HeaderLogged } from '../../components/logged/header/header';
import { Carts } from '../../components/logged/admin/carts/carts';

@Component({
  selector: 'app-admin-cart',
  standalone: true,
  imports: [HeaderLogged, Carts],
  templateUrl: './admin-cart.html',
  styleUrl: './admin-cart.css'
})
export class AdminCart {

}
