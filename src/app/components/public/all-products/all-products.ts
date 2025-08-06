import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../service/product-requisition';
import { CartService } from '../../../service/cart-requisition';
import { UserService } from '../../../service/user-requisition';
import { CategoryService, CategoryResponse } from '../../../service/category-requisition';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-all-products',
  imports: [CommonModule, RouterModule],
  templateUrl: './all-products.html',
  styleUrls: ['./all-products.css']
})
export class AllProducts implements OnInit {
  products: any[] = [];
  categories: CategoryResponse[] = [];
  selectedCategory: number | null = null;
  loading: boolean = true;
  canScrollLeft: boolean = false;
  canScrollRight: boolean = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private userService: UserService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
    
    // Adicionar listener para mudanças no scroll
    setTimeout(() => {
      const carousel = document.querySelector('.categories-carousel') as HTMLElement;
      if (carousel) {
        carousel.addEventListener('scroll', () => {
          this.updateScrollButtons();
        });
      }
    }, 200);
  }

  loadProducts() {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.loading = false;
      }
    });
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        // Aguardar o DOM ser renderizado antes de verificar os botões
        setTimeout(() => this.updateScrollButtons(), 100);
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
      }
    });
  }

  selectCategory(categoryId: number | null) {
    this.selectedCategory = categoryId;
    if (categoryId) {
      this.productService.getProductsByCategory(categoryId).subscribe({
        next: (products) => {
          this.products = products;
        },
        error: (error) => {
          console.error('Erro ao carregar produtos:', error);
        }
      });
    } else {
      this.loadProducts();
    }
  }

  addToCart(product: any) {
    // Verificar se o usuário está logado
    if (!this.userService.isLoggedIn()) {
      // Se não estiver logado, redirecionar para a página de login
      this.router.navigate(['/login']);
      return;
    }

    // Se estiver logado, adicionar ao carrinho e redirecionar
    if (product) {
      this.cartService.addToCart(product, 1);
      this.router.navigate(['/cart']);
    }
  }

  scrollCategories(direction: 'left' | 'right') {
    const carousel = document.querySelector('.categories-carousel') as HTMLElement;
    if (carousel) {
      const scrollAmount = 200;
      const currentScroll = carousel.scrollLeft;
      
      if (direction === 'left') {
        carousel.scrollLeft = currentScroll - scrollAmount;
      } else {
        carousel.scrollLeft = currentScroll + scrollAmount;
      }
      
      // Atualizar botões após um pequeno delay
      setTimeout(() => this.updateScrollButtons(), 100);
    }
  }

  updateScrollButtons() {
    const carousel = document.querySelector('.categories-carousel') as HTMLElement;
    if (carousel) {
      this.canScrollLeft = carousel.scrollLeft > 0;
      this.canScrollRight = carousel.scrollLeft < (carousel.scrollWidth - carousel.clientWidth - 1);
    } else {
      console.log('Carousel não encontrado');
    }
  }
}

