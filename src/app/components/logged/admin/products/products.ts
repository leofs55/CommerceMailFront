import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../../../service/product-requisition';
import { CategoryService, CategoryResponse } from '../../../../service/category-requisition';

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

// Usando a interface do serviço

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  // Propriedades de dados
  products: Product[] = [];
  categories: CategoryResponse[] = [];
  filteredProducts: Product[] = [];
  
  // Propriedades de filtro
  searchTerm: string = '';
  selectedCategory: string = '';
  
  // Propriedades de seleção
  selectedProducts: number[] = [];
  selectAll: boolean = false;
  
  // Propriedades de paginação
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalProducts: number = 0;
  totalPages: number = 0;
  startIndex: number = 0;
  endIndex: number = 0;
  visiblePages: number[] = [];
  
  // Propriedades de ordenação
  sortField: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  // Propriedades de modal
  showDeleteModal: boolean = false;
  productToDelete: Product | null = null;
  showEditModal: boolean = false;
  productToEdit: Product | null = null;
  showCreateModal: boolean = false;
  
  // Propriedades de loading
  loading: boolean = false;
  editLoading: boolean = false;
  createLoading: boolean = false;
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

  // Formulário de criação
  createForm: any = {
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    grams: 0,
    categoryId: '',
    imgUrl: 'assets/images/unnamed.png'
  };

  // Propriedades de imagem
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  createSelectedImage: File | null = null;
  createImagePreview: string | null = null;

  // Dados mock para fallback em caso de erro na API

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  // Métodos de carregamento de dados
  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (products: any[]) => {
        // Mapear os dados da API para o formato esperado pelo componente
        this.products = products.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity,
          grams: product.grams,
          categoryResponse: product.categoryResponse,
          imgUrl: product.imgUrl
        }));
        
        // Aplicar filtros e paginação
        this.filterProducts();
      },
      error: (error: any) => {
        console.error('Erro ao carregar produtos:', error);
        // Em caso de erro, usar dados mock como fallback
        this.filterProducts();
      }
    });
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories: CategoryResponse[]) => {
        this.categories = categories;
      },
      error: (error: any) => {
        console.error('Erro ao carregar categorias:', error);
        // Em caso de erro, extrair categorias dos produtos como fallback
        const uniqueCategories = new Map<number, CategoryResponse>();
        
        this.products.forEach(product => {
          if (product.categoryResponse && !uniqueCategories.has(product.categoryResponse.id)) {
            uniqueCategories.set(product.categoryResponse.id, product.categoryResponse);
          }
        });
        
        this.categories = Array.from(uniqueCategories.values());
      }
    });
  }

  // Métodos de filtro e busca
  filterProducts() {
    let filtered = [...this.products];

    // Filtro por termo de busca
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
      );
    }

    // Filtro por categoria
    if (this.selectedCategory) {
      filtered = filtered.filter(product => 
        product.categoryResponse?.id.toString() === this.selectedCategory
      );
    }



    // Ordenação
    filtered.sort((a, b) => {
      let aValue: any = a[this.sortField as keyof Product];
      let bValue: any = b[this.sortField as keyof Product];
      
      if (this.sortField === 'category') {
        aValue = a.categoryResponse?.name || '';
        bValue = b.categoryResponse?.name || '';
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredProducts = filtered;
    this.totalProducts = filtered.length;
    this.updatePagination();
  }

  // Métodos de ordenação
  sortBy(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.filterProducts();
  }

  // Métodos de seleção
  toggleSelectAll() {
    if (this.selectAll) {
      this.selectedProducts = this.filteredProducts.map(p => p.id);
    } else {
      this.selectedProducts = [];
    }
  }

  toggleProductSelection(productId: number) {
    const index = this.selectedProducts.indexOf(productId);
    if (index > -1) {
      this.selectedProducts.splice(index, 1);
    } else {
      this.selectedProducts.push(productId);
    }
    this.updateSelectAllState();
  }

  updateSelectAllState() {
    this.selectAll = this.selectedProducts.length === this.filteredProducts.length && this.filteredProducts.length > 0;
  }

  // Métodos de paginação
  updatePagination() {
    this.totalPages = Math.ceil(this.totalProducts / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    this.currentPage = Math.max(1, this.currentPage);
    
    this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.endIndex = Math.min(this.startIndex + this.itemsPerPage, this.totalProducts);
    
    this.updateVisiblePages();
  }

  updateVisiblePages() {
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    this.visiblePages = [];
    for (let i = start; i <= end; i++) {
      this.visiblePages.push(i);
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  // Métodos de ações
  openCreateModal() {
    this.showCreateModal = true;
    this.resetCreateForm();
  }

  viewProduct(product: Product) {
    // TODO: Implementar visualização detalhada
    console.log('Visualizar produto:', product);
  }

  editProduct(product: Product) {
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
    
    this.showEditModal = true;
  }

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

  removeImage() {
    this.selectedImage = null;
    this.imagePreview = null;
  }

  removeCreateImage() {
    this.createSelectedImage = null;
    this.createImagePreview = null;
  }

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
    
    // Preparar dados para envio
    const updateData: any = {
      name: this.editForm.name,
      description: this.editForm.description,
      price: this.editForm.price,
      quantity: this.editForm.quantity,
      grams: this.editForm.grams,
      categoryId: this.editForm.categoryId
    };

    // Se há uma nova imagem selecionada, fazer upload primeiro
    if (this.selectedImage) {
      this.uploadImage(this.selectedImage).then(imagePath => {
        updateData.imgUrl = imagePath;
        this.updateProductData(updateData);
      }).catch(error => {
        console.error('Erro no upload da imagem:', error);
        alert('Erro no upload da imagem. Tente novamente.');
        this.editLoading = false;
      });
    } else {
      // Manter a imagem atual se não foi alterada
      if (this.productToEdit.imgUrl) {
        updateData.imgUrl = this.productToEdit.imgUrl;
      }
      this.updateProductData(updateData);
    }
  }

  private updateProductData(updateData: any) {
    this.productService.updateProduct(this.productToEdit!.id, updateData).subscribe({
      next: (response) => {
        console.log('Produto atualizado com sucesso:', response);
        
        // Atualizar o produto na lista local
        const index = this.products.findIndex(p => p.id === this.productToEdit!.id);
        if (index !== -1) {
          this.products[index] = {
            ...this.products[index],
            ...updateData,
            categoryResponse: this.categories.find(c => c.id === updateData.categoryId) || this.products[index].categoryResponse
          };
        }
        
        this.filterProducts();
        this.closeEditModal();
        this.editLoading = false;
        
        // Mensagem de sucesso
        alert('Produto atualizado com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao atualizar produto:', error);
        this.editLoading = false;
        alert('Erro ao atualizar produto. Tente novamente.');
      }
    });
  }

  confirmCreate() {
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
    
    // Preparar dados para envio
    const createData: any = {
      name: this.createForm.name,
      description: this.createForm.description,
      price: this.createForm.price,
      quantity: this.createForm.quantity,
      grams: this.createForm.grams,
      categoryId: this.createForm.categoryId
    };

    // Se há uma imagem selecionada, fazer upload primeiro
    if (this.createSelectedImage) {
      this.uploadCreateImage(this.createSelectedImage).then(imagePath => {
        createData.imgUrl = 'assets/images/unnamed.png';
        this.createProductData(createData);
      }).catch(error => {
        console.error('Erro no upload da imagem:', error);
        alert('Erro no upload da imagem. Tente novamente.');
        this.createLoading = false;
      });
    } else {
      this.createProductData(createData);
    }
  }

  private createProductData(createData: any) {
    this.productService.createProduct(createData).subscribe({
      next: (response) => {
        console.log('Produto criado com sucesso:', response);
        
        // Recarregar produtos para incluir o novo
        this.loadProducts();
        this.closeCreateModal();
        this.createLoading = false;
        
        // Mensagem de sucesso
        alert('Produto criado com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao criar produto:', error);
        this.createLoading = false;
        alert('Erro ao criar produto. Tente novamente.');
      }
    });
  }

  private async uploadCreateImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      this.uploadProgress = 0;
      
      this.productService.uploadImage(file).subscribe({
        next: (response) => {
          this.uploadProgress = 100;
          // Assumindo que a API retorna o caminho da imagem
          const imagePath = response.imagePath || response.imgUrl || `assets/images/${file.name}`;
          resolve(imagePath);
        },
        error: (error) => {
          this.uploadProgress = 0;
          console.error('Erro no upload da imagem:', error);
          reject(error);
        }
      });
    });
  }

  private async uploadImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      this.uploadProgress = 0;
      
      this.productService.uploadImage(file).subscribe({
        next: (response) => {
          this.uploadProgress = 100;
          // Assumindo que a API retorna o caminho da imagem
          const imagePath = response.imagePath || response.imgUrl || `assets/images/${file.name}`;
          resolve(imagePath);
        },
        error: (error) => {
          this.uploadProgress = 0;
          console.error('Erro no upload da imagem:', error);
          reject(error);
        }
      });
    });
  }

  closeEditModal() {
    this.showEditModal = false;
    this.productToEdit = null;
    this.selectedImage = null;
    this.imagePreview = null;
    this.uploadProgress = 0;
    this.editForm = {
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      grams: 0,
      categoryId: '',
      imgUrl: ''
    };
  }

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
  }

  deleteProduct(product: Product) {
    this.productToDelete = product;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.productToDelete) {
      this.loading = true;
      this.productService.deleteProduct(this.productToDelete.id).subscribe({
        next: (response) => {
          console.log('Produto excluído com sucesso:', response);
          // Remove o produto da lista local
          this.products = this.products.filter(p => p.id !== this.productToDelete!.id);
          this.filterProducts();
          this.closeDeleteModal();
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao excluir produto:', error);
          this.loading = false;
          // Aqui você pode adicionar uma notificação de erro para o usuário
          alert('Erro ao excluir produto. Tente novamente.');
        }
      });
    }
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }

  // Métodos de ações em massa
  bulkEdit() {
    // TODO: Implementar edição em massa
    console.log('Editar produtos selecionados:', this.selectedProducts);
  }

  bulkDelete() {
    if (this.selectedProducts.length === 0) return;
    
    if (confirm(`Tem certeza que deseja excluir ${this.selectedProducts.length} produto(s) selecionado(s)? Esta ação não pode ser desfeita.`)) {
      this.loading = true;
      
      // Array para armazenar as observables de exclusão
      const deleteObservables = this.selectedProducts.map(productId => 
        this.productService.deleteProduct(productId)
      );
      
      // Executa todas as exclusões em paralelo usando forkJoin
      forkJoin(deleteObservables).subscribe({
        next: () => {
          console.log('Produtos excluídos com sucesso');
          // Remove os produtos excluídos da lista local
          this.products = this.products.filter(p => !this.selectedProducts.includes(p.id));
          this.selectedProducts = [];
          this.filterProducts();
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao excluir produtos:', error);
          this.loading = false;
          alert('Erro ao excluir alguns produtos. Tente novamente.');
        }
      });
    }
  }


  // Método de tracking para performance
  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}
