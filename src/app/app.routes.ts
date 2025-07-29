import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { SignUp } from './pages/sign-up/sign-up';
import { ProductDetails } from './pages/product-details/product-details'; 
import { Cart } from './pages/cart/cart';
import { AllCarts } from './pages/all-carts/all-carts';
import { Account } from './pages/account/account';
import { StartPayment } from './pages/start-payment/start-payment';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login},
  { path: 'sign-up', component: SignUp},
  { path: 'product/:id', component: ProductDetails },
  { path: 'cart/:id', component: Cart },
  { path: 'all-carts/:id', component: AllCarts },
  { path: 'account/:id', component: Account },
  { path: 'start-payment/:id', component: StartPayment }
];
