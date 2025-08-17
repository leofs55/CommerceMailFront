import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, CartItem, ProductResponse } from '../../../service/cart-requisition';
import { UserService } from '../../../service/user-requisition';
import { ProductService } from '../../../service/product-requisition';

@Component({
  selector: 'app-cart-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  cartItemCount: number = 0;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private cartService: CartService,
    private userService: UserService,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    console.log('Cart ngOnInit iniciado');
    
    // Inscreve para mudanças no carrinho local
    this.cartService.cartItems$.subscribe(items => {
      console.log('Cart items atualizados:', items);
      this.cartItems = items;
      this.cartTotal = this.cartService.getCartTotal();
      this.cartItemCount = this.cartService.getCartItemCount();
      
      // Carregar imagens dos produtos no carrinho
      this.loadAllProductImages();
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  async saveCartToServer(): Promise<void> {
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser) {
      this.errorMessage = 'Usuário não está logado';
      return;
    }

    if (this.cartItems.length === 0) {
      this.errorMessage = 'Carrinho está vazio';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const cartRequest = this.cartService.createCartRequest(currentUser.id);
      await this.cartService.createCart(cartRequest).toPromise();
      
      this.successMessage = 'Carrinho salvo com sucesso!';
      this.cartService.clearCart(); // Limpa o carrinho local após salvar
      
      // Redireciona para a página de pagamento com o ID do usuário
      setTimeout(() => {
        this.router.navigate(['/start-payment', currentUser.id]);
      }, 1500);
    } catch (error: any) {
      this.errorMessage = 'Erro ao salvar carrinho';
    } finally {
      this.isLoading = false;
    }
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  getProductPrice(product: any): number {
    return product.price;
  }

  // Método para carregar imagem de um produto
  loadProductImage(product: ProductResponse) {
    if (!product.imgUrl) return;
    
    this.productService.getImage(product.imgUrl).subscribe({
      next: (imageBlob: Blob) => {
        // Criar URL da imagem a partir do blob retornado
        const imageUrl = URL.createObjectURL(imageBlob);
        
        // Atualizar o produto com a URL da imagem no carrinho
        if (this.cartItems) {
          const cartItem = this.cartItems.find(item => item.product.id === product.id);
          if (cartItem) {
            cartItem.product = {
              ...cartItem.product,
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

  // Método para carregar imagens de todos os produtos no carrinho
  loadAllProductImages() {
    if (!this.cartItems || this.cartItems.length === 0) return;
    
    this.cartItems.forEach(cartItem => {
      if (cartItem.product && cartItem.product.imgUrl) {
        this.loadProductImage(cartItem.product);
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
