import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  totalProducts: number = 0;
  totalCategories: number = 0;
  totalUsers: number = 0;
  totalCarts: number = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadStatistics();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  loadStatistics() {
    // TODO: Implementar carregamento real das estatísticas
    // Por enquanto, usando valores mock
    this.totalProducts = 25;
    this.totalCategories = 8;
    this.totalUsers = 150;
    this.totalCarts = 12;
  }
}
