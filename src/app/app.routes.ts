import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { SignUp } from './pages/sign-up/sign-up';
import { ProductDetails } from './pages/product-details/product-details'; 
import { Cart } from './pages/cart/cart';
import { AllCarts } from './pages/all-carts/all-carts';
import { Account } from './pages/account/account';
import { StartPayment } from './pages/start-payment/start-payment';
import { ResetPassword } from './pages/reset-password/reset-password';
import { CreateNewPassword } from './components/public/create-new-password/create-new-password';
import { CartDetails } from './pages/cart-details/cart-details';
import { Admin } from './pages/admin/admin';
import { AdminCategory } from './pages/admin-category/admin-category';
import { AdminProducts } from './pages/admin-products/admin-products';
import { AdminUsers } from './pages/admin-users/admin-users';
import { AdminFeedback } from './pages/admin-feedback/admin-feedback';
import { AdminCart } from './pages/admin-cart/admin-cart';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login},
  { path: 'sign-up', component: SignUp},
  { path: 'product/:id', component: ProductDetails },
  { path: 'cart', component: Cart },
  { path: 'cart/:id', component: Cart },
  { path: 'all-carts/:id', component: AllCarts },
  { path: 'account/:id', component: Account },
  { path: 'start-payment/:id', component: StartPayment },
  { path: 'reset-password', component: ResetPassword },
  { path: 'reset-password/:id', component: CreateNewPassword },
  { path: 'cart-details/:id', component: CartDetails },
  { path: 'admin', component: Admin },
  { path: 'admin/category', component: AdminCategory },
  { path: 'admin/product', component: AdminProducts },
  { path: 'admin/users', component: AdminUsers },
  { path: 'admin/feedback', component: AdminFeedback },
  { path: 'admin/carts', component: AdminCart }


];
