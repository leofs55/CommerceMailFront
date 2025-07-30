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