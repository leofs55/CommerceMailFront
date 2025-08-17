import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../service/product-requisition';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService, ProductResponse } from '../../../service/cart-requisition';
import { UserService } from '../../../service/user-requisition';

@Component({
  selector: 'app-products-featured',
  
  imports: [CommonModule],
  templateUrl: './products-featured.html',
  styleUrls: ['./products-featured.css']
})
export class ProductsFeatured implements OnInit {
  featuredProducts: any[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private userService: UserService,
    private router: Router) {}

  ngOnInit() {
    const ids = [1, 2, 3, 4];
    ids.forEach(id => {
      this.productService.getProductById(id).subscribe(product => {
        if (product) {
          this.featuredProducts.push(product);
          // Carregar imagem do produto após adicioná-lo à lista
          this.loadProductImage(product);
        }
      });
    });
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

  // Método para carregar imagem de um produto
  loadProductImage(product: ProductResponse) {
    if (!product.imgUrl) return;
    
    this.productService.getImage(product.imgUrl).subscribe({
      next: (imageBlob: Blob) => {
        // Criar URL da imagem a partir do blob retornado
        const imageUrl = URL.createObjectURL(imageBlob);
        
        // Atualizar o produto com a URL da imagem
        if (this.featuredProducts) {
          const index = this.featuredProducts.findIndex(p => p.id === product.id);
          if (index !== -1) {
            this.featuredProducts[index] = {
              ...this.featuredProducts[index],
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

  // Método para obter a URL da imagem de um produto
  getProductImage(product: ProductResponse): string {
    if (product.imgUrl && (product.imgUrl.startsWith('blob:') || product.imgUrl.startsWith('data:image'))) {
      // Se já é uma URL de blob ou dados (base64), usar diretamente
      return product.imgUrl;
    } else if (product.imgUrl) {
      // Se é apenas o nome do arquivo, retornar imagem padrão até carregar
      return 'public/assets/images/imageFeatured.png';
    } else {
      // Se não há imagem, usar imagem padrão
      return 'public/assets/images/imageFeatured.png';
    }
  }

  // Método para tratar erro de carregamento de imagem
  onImageError(event: any, product: ProductResponse) {
    console.log(`Erro ao carregar imagem do produto ${product.name}, usando imagem padrão`);
    event.target.src = 'public/assets/images/imageFeatured.png';
  }
}