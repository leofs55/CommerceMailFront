import { Component } from '@angular/core';
import { HeaderLogged } from '../../components/logged/header/header';
import { Products } from '../../components/logged/admin/products/products';

@Component({
  selector: 'app-admin-products',
  imports: [HeaderLogged, Products],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css'
})
export class AdminProducts {

}
