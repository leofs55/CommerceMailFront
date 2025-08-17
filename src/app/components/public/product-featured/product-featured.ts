import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../../service/product-requisition';
import { CartService, ProductResponse } from '../../../service/cart-requisition';
import { UserService } from '../../../service/user-requisition';

@Component({
  selector: 'app-product-featured',
  imports: [CommonModule],
  templateUrl: './product-featured.html',
  styleUrl: './product-featured.css'
})
export class ProductFeatured implements OnInit {
  product: any;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productService.getProductById(1)
      .subscribe(data => {
        console.log('Produto carregado:', data);
        this.product = data;
        // Carregar imagem do produto após obtê-lo
        this.loadProductImage(this.product);
      });
  }

  addToCart() {
    console.log('addToCart chamado');
    
    // Verificar se o usuário está logado
    if (!this.userService.isLoggedIn()) {
      // Se não estiver logado, redirecionar para a página de login
      this.router.navigate(['/login']);
      return;
    }

    // Se estiver logado, adicionar ao carrinho e redirecionar
    if (this.product) {
      console.log('Adicionando produto ao carrinho:', this.product);
      this.cartService.addToCart(this.product, 1);
      this.navigateToCart();
    } else {
      console.log('Produto não disponível');
    }
  }

  buyNow() {
    console.log('buyNow chamado');
    
    // Verificar se o usuário está logado
    if (!this.userService.isLoggedIn()) {
      // Se não estiver logado, redirecionar para a página de login
      this.router.navigate(['/login']);
      return;
    }

    // Se estiver logado, adicionar ao carrinho e redirecionar
    if (this.product) {
      console.log('Comprando produto:', this.product);
      this.cartService.addToCart(this.product, 1);
      this.navigateToCart();
    } else {
      console.log('Produto não disponível');
    }
  }

  private navigateToCart() {
    console.log('Navegando para o carrinho');
    this.router.navigate(['/cart']);
  }

  // Método para carregar imagem de um produto
  loadProductImage(product: ProductResponse) {
    if (!product || !product.imgUrl) return;
    
    this.productService.getImage(product.imgUrl).subscribe({
      next: (imageBlob: Blob) => {
        // Criar URL da imagem a partir do blob retornado
        const imageUrl = URL.createObjectURL(imageBlob);
        
        // Atualizar o produto com a URL da imagem
        this.product = {
          ...this.product,
          imgUrl: imageUrl
        };
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
