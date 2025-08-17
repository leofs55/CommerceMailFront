import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../service/product-requisition';
import { CartService, ProductResponse } from '../../../service/cart-requisition';
import { UserService } from '../../../service/user-requisition';
import { CategoryService, CategoryResponse } from '../../../service/category-requisition';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-products',
  
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './all-products.html',
  styleUrls: ['./all-products.css']
})
export class AllProducts implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: CategoryResponse[] = [];
  selectedCategory: number | null = null;
  searchTerm: string = '';
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
        this.filteredProducts = [...products]; // Inicializar filteredProducts
        this.loading = false;
        // Carregar imagens após os produtos serem obtidos
        this.loadAllProductImages();
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
          this.filteredProducts = [...products]; // Atualizar filteredProducts
          // Carregar imagens após os produtos da categoria serem obtidos
          this.loadAllProductImages();
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

  loadProductImage(product: ProductResponse) {
    if (!product.imgUrl) return;
    
    this.productService.getImage(product.imgUrl).subscribe({
      next: (imageBlob: Blob) => {
        // Criar URL da imagem a partir do blob retornado
        const imageUrl = URL.createObjectURL(imageBlob);
        
        // Atualizar o produto com a URL da imagem em ambos os arrays
        if (this.products) {
          const index = this.products.findIndex(p => p.id === product.id);
          if (index !== -1) {
            this.products[index] = {
              ...this.products[index],
              imgUrl: imageUrl
            };
          }
        }
        
        if (this.filteredProducts) {
          const index = this.filteredProducts.findIndex(p => p.id === product.id);
          if (index !== -1) {
            this.filteredProducts[index] = {
              ...this.filteredProducts[index],
              imgUrl: imageUrl
            };
          }
        }
      },
      error: (error: any) => {
        console.error(`Erro ao carregar imagem do produto ${product.name}:`, error);
        // Em caso de erro, manter a imgUrl original ou usar imagem padrão
      }
    });
  }

  // Método para carregar imagens de todos os produtos
  loadAllProductImages() {
    if (!this.filteredProducts) return;
    
    this.filteredProducts.forEach(product => {
      if (product.imgUrl) {
        this.loadProductImage(product);
      }
    });
  }

  // Método para obter a URL da imagem de um produto
  getProductImage(product: ProductResponse): string {
    if (product.imgUrl && (product.imgUrl.startsWith('blob:') || product.imgUrl.startsWith('data:image'))) {
      // Se já é uma URL de blob ou dados (base64), usar diretamente
      return product.imgUrl;
    } else if (product.imgUrl) {
      // Se é apenas o nome do arquivo, retornar imagem padrão até carregar
      return 'assets/images/default-product.png';
    } else {
      // Se não há imagem, usar imagem padrão
      return 'assets/images/default-product.png';
    }
  }

  // Método para tratar erro de carregamento de imagem
  onImageError(event: any, product: ProductResponse) {
    console.log(`Erro ao carregar imagem do produto ${product.name}, usando imagem padrão`);
    event.target.src = 'assets/images/default-product.png';
  }

  // Método para lidar com mudanças na busca
  onSearchChange() {
    this.performSearch();
  }

  // Método para realizar a busca
  performSearch() {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredProducts = [...this.products];
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(term) ||
        (product.description && product.description.toLowerCase().includes(term))
      );
    }
  }

  // Método para limpar a busca
  clearSearch() {
    this.searchTerm = '';
    this.filteredProducts = [...this.products];
  }
}

