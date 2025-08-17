import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService, CartResponse, ProductResponse } from '../../../service/cart-requisition';
import { UserService } from '../../../service/user-requisition';
import { FeedbackService, FeedbackResponse, FeedbackCreateRequest, FeedbackUpdateRequest } from '../../../service/feedback-requisition';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../service/product-requisition';

@Component({
  selector: 'app-cart-details-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-details.html',
  styleUrl: './cart-details.css'
})
export class CartDetails implements OnInit {
  cart: CartResponse | null = null;
  loading: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';
  cartMessage: string = '';
  feedback: FeedbackResponse | null = null;
  isEditing: boolean = false;
  feeedbackForm = {
    description: '',
    rating: 0,
    userId: 0,  
    cartId: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private userService: UserService,
    private feedbackService: FeedbackService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    console.log('CartDetails component initialized');
    this.loadCartDetails();
  }

  loadCartDetails(): void {
    const cartId = this.route.snapshot.paramMap.get('id');
    console.log('ID do carrinho recebido na URL:', cartId);
    
    if (!cartId) {
      this.errorMessage = 'ID do carrinho não encontrado na URL';
      this.loading = false;
      return;
    }

    console.log('Buscando carrinho com ID:', cartId);
    this.cartService.findCartById(cartId).subscribe({
      next: (cart: CartResponse) => {
        this.cart = cart;
        this.cartMessage = this.cartService.formatCartMessage(cart);
        this.loading = false;
        this.errorMessage = '';
        
        // Carregar imagens de todos os produtos após carregar o carrinho
        this.loadAllProductImages();
      },
      error: (error: any) => {
        console.error('Erro ao carregar detalhes do carrinho:', error);
        this.errorMessage = 'Erro ao carregar detalhes do carrinho. Tente novamente.';
        this.loading = false;
      }
    });
    
    if (!this.isCartOpen()) {
      this.feedbackService.getFeedbackById(cartId).subscribe({
        next: (feedback: FeedbackResponse) => {
          this.feedback = feedback;
          this.feeedbackForm = {
            description: feedback.description,
            rating: feedback.rating,
            userId: feedback.userId,
            cartId: feedback.cartId
          };
        },
      });
    }
  }

  repeatStars(rating: number): string {
    const estrela: string = '★';
    return estrela.repeat(rating);
  }

  submitFeedback(): void {
    const cartId = this.route.snapshot.paramMap.get('id');
    const currentUser = this.userService.getCurrentUser();
    const userId = currentUser ? currentUser.id : null;

    if (!userId) {
      this.errorMessage = 'Usuário não encontrado. Faça login novamente.';
      return;
    }

    if (!this.feeedbackForm.description || !this.feeedbackForm.rating) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    const feedbackRequest: FeedbackCreateRequest = {
      description: this.feeedbackForm.description,
      rating: this.feeedbackForm.rating,
      cartId: cartId || '',
      userId: userId
    };

    this.feedbackService.createFeedback(feedbackRequest).subscribe({
      next: (response) => {
        this.successMessage = 'Depoimento enviado com sucesso!';
        
        // Buscar detalhes do usuário para exibir no feedback
        if (currentUser) {
          this.userService.getUserDetails(currentUser.id).subscribe({
            next: (userDetails) => {
              this.feedback = {
                id: response.id,
                description: response.description,
                rating: response.rating,
                cartId: cartId || '',
                userId: userId,
                userResponse: userDetails
              };
            },
            error: (error) => {
              console.error('Erro ao buscar detalhes do usuário:', error);
              // Criar feedback sem detalhes completos do usuário
              this.feedback = {
                id: response.id,
                description: response.description,
                rating: response.rating,
                cartId: cartId || '',
                userId: userId,
                userResponse: {
                  id: currentUser.id,
                  name: 'Usuário',
                  email: '',
                  numberPhone: ''
                }
              };
            }
          });
        }
        
        // Limpar formulário
        this.feeedbackForm = {
          description: '',
          rating: 0,
          userId: 0,
          cartId: ''
        };

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Erro ao enviar depoimento:', error);
        this.errorMessage = 'Erro ao enviar depoimento. Tente novamente.';
             }
     });
   }

   startEditing(): void {
     if (this.feedback) {
       this.isEditing = true;
       this.feeedbackForm = {
         description: this.feedback.description,
         rating: this.feedback.rating,
         userId: this.feedback.userId,
         cartId: this.feedback.cartId
       };
     }
   }

   cancelEditing(): void {
     this.isEditing = false;
     if (this.feedback) {
       this.feeedbackForm = {
         description: this.feedback.description,
         rating: this.feedback.rating,
         userId: this.feedback.userId,
         cartId: this.feedback.cartId
       };
     }
   }

   updateFeedback(): void {
     const cartId = this.route.snapshot.paramMap.get('id');
     const currentUser = this.userService.getCurrentUser();
     const userId = currentUser ? currentUser.id : null;

     if (!userId || !this.feedback) {
       this.errorMessage = 'Usuário não encontrado ou feedback não disponível.';
       return;
     }

     if (!this.feeedbackForm.description || !this.feeedbackForm.rating) {
       this.errorMessage = 'Por favor, preencha todos os campos.';
       return;
     }

     const feedbackRequest: FeedbackUpdateRequest = {
       description: this.feeedbackForm.description,
       rating: this.feeedbackForm.rating,
       cartId: cartId || '',
       userId: userId
     };

     this.feedbackService.updateFeedback(feedbackRequest).subscribe({
       next: (response) => {
         this.successMessage = 'Avaliação atualizada com sucesso!';
         
         // Atualizar o feedback local
         if (this.feedback) {
           this.feedback.description = response.description;
           this.feedback.rating = response.rating;
         }
         
         this.isEditing = false;

         setTimeout(() => {
           this.successMessage = '';
         }, 3000);
       },
       error: (error) => {
         console.error('Erro ao atualizar depoimento:', error);
         this.errorMessage = 'Erro ao atualizar depoimento. Tente novamente.';
       }
     });
   }

   redirectToWhatsApp(): void {
    if (this.cartMessage) {
      const encodedMessage = encodeURIComponent(this.cartMessage);
      const whatsappUrl = `https://wa.me/5511944636254?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
      this.successMessage = 'Redirecionando para WhatsApp...';
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    }
  }

  isCartOpen(): boolean {
    return this.cart?.status === 'OPEN';
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'open':
        return '#48bb78'; // Verde
      case 'sold':
        return '#1c8546'; // Vermelho
      default:
        return '#718096'; // Cinza
    }
  }

  getStatusText(status: string): string {
    switch (status.toLowerCase()) {
      case 'open':
        return 'Aberto';
      case 'sold':
        return 'Concluído';
      default:
        return status;
    }
  }
  
  getStatusClass(): string {
    switch (this.cart?.status) {
      case 'OPEN':
        return 'status-open';
      case 'CLOSED':
        return 'status-closed';
      case 'PENDING':
        return 'status-pending';
      default:
        return 'status-unknown';
    }
  }

  formatPrice(price: number): string {
    return `R$ ${parseFloat(price.toString()).toFixed(2)}`;
  }

  goBack(): void {
    const userId = this.cart?.user.id;
    console.log('Voltando para lista de carrinhos do usuário:', userId);
    console.log('URL de destino:', `/all-carts/${userId}`);
    this.router.navigate(['/all-carts', userId || '']);
  }

  clearErrorMessage(): void {
    this.errorMessage = '';
  }


  loadProductImage(product: ProductResponse) {
    if (!product.imgUrl) return;
    
    this.productService.getImage(product.imgUrl).subscribe({
      next: (imageBlob: Blob) => {
        // Criar URL da imagem a partir do blob retornado
        const imageUrl = URL.createObjectURL(imageBlob);
        
        // Atualizar o produto com a URL da imagem
        if (this.cart?.productResponses) {
          const index = this.cart.productResponses.findIndex(p => p.id === product.id);
          if (index !== -1) {
            this.cart.productResponses[index] = {
              ...this.cart.productResponses[index],
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

  // Método para carregar imagens de todos os produtos do carrinho
  loadAllProductImages() {
    if (!this.cart?.productResponses) return;
    
    this.cart.productResponses.forEach(product => {
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
}
