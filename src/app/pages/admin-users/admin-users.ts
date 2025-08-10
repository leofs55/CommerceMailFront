import { Component } from '@angular/core';
import { HeaderLogged } from '../../components/logged/header/header';
import { Users } from '../../components/logged/admin/users/users';

@Component({
  selector: 'app-admin-users',
  imports: [HeaderLogged, Users],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css'
})
export class AdminUsers {

}
