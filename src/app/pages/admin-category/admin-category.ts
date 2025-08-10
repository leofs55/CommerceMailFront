import { Component } from '@angular/core';
import { HeaderLogged } from '../../components/logged/header/header';
import { Category } from '../../components/logged/admin/category/category';
@Component({
  selector: 'app-admin-category',
  imports: [HeaderLogged, Category],
  templateUrl: './admin-category.html',
  styleUrl: './admin-category.css'
})
export class AdminCategory {

}
