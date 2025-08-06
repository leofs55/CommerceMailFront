import { Component } from '@angular/core';
import { HeaderLogged } from '../../components/logged/header/header';
import { Home } from "../../components/logged/admin/home/home";

@Component({
  selector: 'app-admin',
  imports: [HeaderLogged, Home],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {

}
