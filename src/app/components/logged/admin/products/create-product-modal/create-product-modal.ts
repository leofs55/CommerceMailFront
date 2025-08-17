import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../../service/product-requisition';
import { CategoryResponse } from '../../../../../service/category-requisition';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  grams: number;
  categoryResponse: CategoryResponse;
  imgUrl?: string;
}

@Component({
  selector: 'app-create-product-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-product-modal.html',
  styleUrl: './create-product-modal.css'
})
export class CreateProductModal implements OnInit {
  @Input() showCreateModal: boolean = false;
  @Input() categories: CategoryResponse[] = [];
  @Output() modalClosed = new EventEmitter<void>();
  @Output() productCreated = new EventEmitter<void>();

  // Propriedades de loading
  createLoading: boolean = false;
  uploadProgress: number = 0;

  // Formulário de criação
  createForm: any = {
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    grams: 0,
    categoryId: '',
    imgUrl: ''
  };

  // Propriedades de imagem
  createSelectedImage: File | null = null;
  createImagePreview: string | null = null;

  constructor(
    private productService: ProductService
  ) {}

  ngOnInit() {
    // Componente inicializado
  }

  // Métodos de imagem
  onCreateImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.createSelectedImage = file;
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.createImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeCreateImage() {
    this.createSelectedImage = null;
    this.createImagePreview = null;
  }

  // Método de criação
  async confirmCreate() {
    // Validações básicas
    if (!this.createForm.name || !this.createForm.description || 
        !this.createForm.price || !this.createForm.quantity || 
        !this.createForm.grams || !this.createForm.categoryId) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    if (this.createForm.price <= 0) {
      alert('O preço deve ser maior que zero.');
      return;
    }
    
    if (this.createForm.quantity < 0) {
      alert('A quantidade não pode ser negativa.');
      return;
    }
    
    if (this.createForm.grams <= 0) {
      alert('O peso deve ser maior que zero.');
      return;
    }
    
    this.createLoading = true;
    
    try {
      let imgUrl = '';
      
      // Se há uma imagem selecionada, fazer upload primeiro
      if (this.createSelectedImage) {
        imgUrl = await this.uploadCreateImage(this.createSelectedImage);
      }
      
      // Preparar dados para envio incluindo a imgUrl
      const createData: any = {
        name: this.createForm.name,
        description: this.createForm.description,
        price: this.createForm.price,
        quantity: this.createForm.quantity,
        grams: this.createForm.grams,
        categoryId: this.createForm.categoryId,
        imgUrl: imgUrl // Incluir a URL da imagem se foi feito upload
      };

      // Criar o produto com todas as informações
      await this.createProductData(createData);
      
      // Emitir evento de sucesso
      this.productCreated.emit();
      this.closeCreateModal();
      this.createLoading = false;
      
      // Mensagem de sucesso
      alert('Produto criado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      this.createLoading = false;
      alert('Erro ao criar produto. Tente novamente.');
    }
  }

  private async createProductData(createData: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.productService.createProduct(createData).subscribe({
        next: (response: any) => {
          console.log('Produto criado com sucesso:', response);
          resolve();
        },
        error: (error: any) => {
          console.error('Erro ao criar produto:', error);
          reject(error);
        }
      });
    });
  }

  private async uploadCreateImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      this.uploadProgress = 0;
      
      this.productService.uploadImage(file).subscribe({
        next: (response: any) => {
          this.uploadProgress = 100;
          
          // A API retorna uma string simples, não JSON
          let imagePath = '';
          
          if (typeof response === 'string') {
            // Se for string direta
            imagePath = response;
          } else if (response && typeof response === 'object') {
            // Se for objeto, tentar extrair o caminho
            imagePath = response.imgUrl || response.imagePath || response.path || response;
          } else {
            // Fallback para string
            imagePath = String(response);
          }
          
          console.log('Upload da imagem bem-sucedido:', imagePath);
          resolve(imagePath);
        },
        error: (error: any) => {
          this.uploadProgress = 0;
          console.error('Erro no upload da imagem:', error);
          reject(error);
        }
      });
    });
  }

  // Métodos de controle do modal
  resetCreateForm() {
    this.createForm = {
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      grams: 0,
      categoryId: '',
      imgUrl: ''
    };
    this.createSelectedImage = null;
    this.createImagePreview = null;
    this.uploadProgress = 0;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.resetCreateForm();
    this.modalClosed.emit();
  }
}
