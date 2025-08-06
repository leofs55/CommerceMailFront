import { Component, HostListener, OnInit } from '@angular/core';
import { UserService } from '../../../service/user-requisition';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-logged',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderLogged implements OnInit {
  dropdownOpen = false;
  user: any = null;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    console.log(this.user);
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    this.userService.logout();
    this.dropdownOpen = false;
    // Redirecionar para a home após logout
    this.router.navigate(['/']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.account-dropdown')) {
      this.dropdownOpen = false;
    }
  }
}