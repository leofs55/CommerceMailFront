import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
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
  selector: 'app-update-product-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-product-modal.html',
  styleUrl: './update-product-modal.css'
})
export class UpdateProductModal implements OnInit, OnChanges {
  @Input() showEditModal: boolean = false;
  @Input() productToEdit: Product | null = null;
  @Input() categories: CategoryResponse[] = [];
  @Output() modalClosed = new EventEmitter<void>();
  @Output() productUpdated = new EventEmitter<void>();

  // Propriedades de loading
  editLoading: boolean = false;
  uploadProgress: number = 0;

  // Formulário de edição
  editForm: any = {
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    grams: 0,
    categoryId: '',
    imgUrl: ''
  };

  // Propriedades de imagem
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private productService: ProductService
  ) {}

  ngOnInit() {
    // Componente inicializado
  }

  ngOnChanges(changes: SimpleChanges) {
    // Detecta mudanças no produto a ser editado
    if (changes['productToEdit'] && this.productToEdit) {
      this.setProductForEdit(this.productToEdit);
    }
  }

  // Método para configurar o produto para edição
  setProductForEdit(product: Product) {
    this.productToEdit = product;
    this.editForm = {
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      grams: product.grams,
      categoryId: product.categoryResponse?.id || '',
      imgUrl: product.imgUrl || ''
    };
    
    // Resetar imagem
    this.selectedImage = null;
    this.imagePreview = product.imgUrl || null;
  }

  // Métodos de imagem
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedImage = null;
    this.imagePreview = null;
  }

  // Método de edição
  confirmEdit() {
    if (!this.productToEdit) return;
    
    // Validações básicas
    if (!this.editForm.name || !this.editForm.description || 
        !this.editForm.price || !this.editForm.quantity || 
        !this.editForm.grams || !this.editForm.categoryId) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    if (this.editForm.price <= 0) {
      alert('O preço deve ser maior que zero.');
      return;
    }
    
    if (this.editForm.quantity < 0) {
      alert('A quantidade não pode ser negativa.');
      return;
    }
    
    if (this.editForm.grams <= 0) {
      alert('O peso deve ser maior que zero.');
      return;
    }
    
    this.editLoading = true;
    
    try {
      let imgUrl = this.productToEdit.imgUrl || ''; // Manter imagem atual por padrão
      
      // Se há uma nova imagem selecionada, fazer upload primeiro
      if (this.selectedImage) {
        this.uploadImage(this.selectedImage).then(imagePath => {
          imgUrl = imagePath;
          this.updateProductData(imgUrl);
        }).catch(error => {
          console.error('Erro no upload da imagem:', error);
          alert('Erro no upload da imagem. Tente novamente.');
          this.editLoading = false;
        });
      } else {
        // Manter a imagem atual se não foi alterada
        this.updateProductData(imgUrl);
      }
    } catch (error) {
      console.error('Erro ao editar produto:', error);
      this.editLoading = false;
      alert('Erro ao editar produto. Tente novamente.');
    }
  }

  private updateProductData(imgUrl: string) {
    if (!this.productToEdit) return;
    
    // Preparar dados para envio incluindo a imgUrl
    const updateData: any = {
      name: this.editForm.name,
      description: this.editForm.description,
      price: this.editForm.price,
      quantity: this.editForm.quantity,
      grams: this.editForm.grams,
      categoryId: this.editForm.categoryId,
      imgUrl: imgUrl
    };
    
    this.productService.updateProduct(this.productToEdit.id, updateData).subscribe({
      next: (response: any) => {
        console.log('Produto atualizado com sucesso:', response);
        
        // Emitir evento de sucesso
        this.productUpdated.emit();
        this.closeEditModal();
        this.editLoading = false;
        
        // Mensagem de sucesso
        alert('Produto atualizado com sucesso!');
      },
      error: (error: any) => {
        console.error('Erro ao atualizar produto:', error);
        this.editLoading = false;
        alert('Erro ao atualizar produto. Tente novamente.');
      }
    });
  }

  private async uploadImage(file: File): Promise<string> {
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
  closeEditModal() {
    this.showEditModal = false;
    this.productToEdit = null;
    this.selectedImage = null;
    this.imagePreview = null;
    this.uploadProgress = 0;
    this.resetEditForm();
    this.modalClosed.emit();
  }

  resetEditForm() {
    this.editForm = {
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      grams: 0,
      categoryId: '',
      imgUrl: ''
    };
    this.selectedImage = null;
    this.imagePreview = null;
    this.uploadProgress = 0;
  }
}
