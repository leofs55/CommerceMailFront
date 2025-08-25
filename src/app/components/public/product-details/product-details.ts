import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../service/product-requisition';
import { CartService } from '../../../service/cart-requisition';
import { UserService } from '../../../service/user-requisition';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {
  productId: string | null = null;
  product: any = null;
  loading = true;
  error = false;
  quantity: number = 1;
  addingToCart = false;
  cartMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      
      if (id) {
        this.loading = true;
        this.error = false;
        this.product = null;
        
        this.productService.getProductById(Number(id)).subscribe({
          next: (produto) => {
            this.product = produto;
            // Carregar a imagem do produto após obter os dados
            if (this.product && this.product.imgUrl) {
              this.loadProductImage(this.product);
            }
            this.loading = false;
          },
          error: (error) => {
            this.error = true;
            this.loading = false;
          }
        });
      } else {
        this.error = true;
        this.loading = false;
      }
    });
  }

  // Função para obter a imagem do produto
  getProductImage(product: any): string {
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

  // Função para tratar erro de carregamento de imagem
  onImageError(event: any, product: any) {
    console.log(`Erro ao carregar imagem do produto ${product.name}, usando imagem padrão`);
    event.target.src = 'assets/images/default-product.png';
  }

  // Função para carregar a imagem do produto
  loadProductImage(product: any) {
    if (!product.imgUrl) return;
    
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

  // Métodos para controlar quantidade
  increaseQuantity(): void {
    if (this.quantity < 99) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  onQuantityChange(event: any): void {
    const value = parseInt(event.target.value);
    if (value && value > 0 && value <= 99) {
      this.quantity = value;
    } else {
      this.quantity = 1;
    }
  }

  // Adicionar ao carrinho
  async addToCart(): Promise<void> {
    if (!this.product) return;

    this.addingToCart = true;
    this.cartMessage = '';

    // Converter produto para o formato esperado pelo carrinho
    const cartProduct = {
      id: this.product.id,
      name: this.product.name,
      description: this.product.description,
      price: this.product.price,
      imgUrl: this.product.imgUrl,
      quantity: this.quantity
    };

    const currentUser = this.userService.getCurrentUser();
    const userId = currentUser?.id;

    await this.cartService.addToCartWithExistingCheck(cartProduct, this.quantity, userId);
    
    // Feedback visual
    this.cartMessage = `✅ ${this.quantity} ${this.quantity === 1 ? 'item' : 'itens'} adicionado${this.quantity === 1 ? '' : 's'} ao carrinho!`;
    
    // Aguarda um pouco para mostrar a mensagem e depois redireciona
    setTimeout(() => {
      this.router.navigate(['/cart']);
    }, 1000);

    this.addingToCart = false;
  }

  // Formatar preço
  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  // Calcular preço total
  getTotalPrice(): number {
    return this.product ? this.product.price * this.quantity : 0;
  }
}