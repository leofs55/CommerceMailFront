import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { SignUp } from './pages/sign-up/sign-up';
import { ProductDetails } from './pages/product-details/product-details'; 

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login},
  { path: 'product/:id', component: ProductDetails }
];
