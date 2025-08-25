import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../../../service/product-requisition';
import { CategoryService, CategoryResponse } from '../../../../service/category-requisition';
import { UserService } from '../../../../service/user-requisition';
import { CreateProductModal } from './create-product-modal/create-product-modal';
import { UpdateProductModal } from './update-product-modal/update-product-modal';

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
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, CreateProductModal, UpdateProductModal],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  // Propriedades de dados
  products: Product[] = [];
  categories: CategoryResponse[] = [];
  filteredProducts: Product[] = [];
  
  // Propriedades de filtro e busca
  searchTerm: string = '';
  selectedCategory: string = '';
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  // Propriedades de seleção
  selectedProducts: number[] = [];
  selectAll: boolean = false;
  
  // Propriedades dos modais
  showDeleteModal: boolean = false;
  productToDelete: Product | null = null;
  showCreateModal: boolean = false;
  showEditModal: boolean = false;
  productToEdit: Product | null = null;
  
  // Propriedades de loading
  loading: boolean = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Validar se o usuário é admin antes de carregar a página
    if (!this.userService.checkAdminRoleAndRedirect('/')) {
      return;
    }
    
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
        
        // Carregar as imagens dos produtos
        this.loadProductImages();
        
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

  // Método para carregar as imagens dos produtos
  loadProductImages() {
    this.products.forEach(product => {
      if (product.imgUrl) {
        this.loadProductImage(product);
      }
    });
  }

  // Método para carregar uma imagem específica de um produto
  loadProductImage(product: Product) {
    if (!product.imgUrl) return;
    
    this.productService.getImage(product.imgUrl).subscribe({
      next: (imageBlob: Blob) => {
        // Criar URL da imagem a partir do blob retornado
        const imageUrl = URL.createObjectURL(imageBlob);
        
        // Atualizar o produto com a URL da imagem
        const index = this.products.findIndex(p => p.id === product.id);
        if (index !== -1) {
          this.products[index] = {
            ...this.products[index],
            imgUrl: imageUrl
          };
        }
        
        // Atualizar a lista filtrada se necessário
        this.filterProducts();
      },
      error: (error: any) => {
        console.error(`Erro ao carregar imagem do produto ${product.name}:`, error);
        // Em caso de erro, manter a imgUrl original ou usar imagem padrão
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

  // Método para filtrar produtos
  filterProducts() {
    let filtered = this.products;
    
    // Filtro por termo de busca
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
      );
    }
    
    // Filtro por categoria
    if (this.selectedCategory) {
      filtered = filtered.filter(product => 
        product.categoryResponse?.id === parseInt(this.selectedCategory)
      );
    }
    
    // Ordenação
    if (this.sortField) {
      filtered.sort((a: any, b: any) => {
        let aValue = a[this.sortField];
        let bValue = b[this.sortField];
        
        // Tratamento especial para campos aninhados
        if (this.sortField === 'categoryResponse') {
          aValue = a.categoryResponse?.name || '';
          bValue = b.categoryResponse?.name || '';
        }
        
        if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    this.filteredProducts = filtered;
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

  // Método para alternar seleção de um produto
  toggleProductSelection(productId: number) {
    const index = this.selectedProducts.indexOf(productId);
    if (index === -1) {
      this.selectedProducts.push(productId);
    } else {
      this.selectedProducts.splice(index, 1);
    }
    this.updateSelectAllState();
  }

  updateSelectAllState() {
    this.selectAll = this.selectedProducts.length === this.filteredProducts.length && this.filteredProducts.length > 0;
  }

  // Métodos de ações básicas
  openCreateModal() {
    this.showCreateModal = true;
  }

  editProduct(product: Product) {
    this.productToEdit = product;
    this.showEditModal = true;
  }

  deleteProduct(product: Product) {
    this.productToDelete = product;
    this.showDeleteModal = true;
  }

  // Métodos do modal de exclusão
  closeDeleteModal() {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }

  confirmDelete() {
    if (this.productToDelete) {
      this.loading = true;
      this.productService.deleteProduct(this.productToDelete.id).subscribe({
        next: (response: any) => {
          console.log('Produto excluído com sucesso:', response);
          
          // Remove o produto da lista local
          this.products = this.products.filter(p => p.id !== this.productToDelete!.id);
          this.filterProducts();
          this.closeDeleteModal();
          this.loading = false;
          
          // Mensagem de sucesso
          alert('Produto excluído com sucesso!');
        },
        error: (error: any) => {
          console.error('Erro ao excluir produto:', error);
          this.loading = false;
          alert('Erro ao excluir produto. Tente novamente.');
        }
      });
    }
  }

  // Métodos de controle dos modais
  closeCreateModal() {
    this.showCreateModal = false;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.productToEdit = null;
  }

  // Eventos dos modais
  onProductCreated() {
    this.loadProducts(); // Recarrega a lista de produtos
    this.closeCreateModal();
  }

  onProductUpdated() {
    this.loadProducts(); // Recarrega a lista de produtos
    this.closeEditModal();
  }

  onModalClosed() {
    this.closeCreateModal();
    this.closeEditModal();
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

  // Método para obter a URL da imagem de um produto
  getProductImage(product: Product): string {
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
  onImageError(event: any, product: Product) {
    console.log(`Erro ao carregar imagem do produto ${product.name}, usando imagem padrão`);
    event.target.src = 'assets/images/default-product.png';
  }

  // Método de tracking para performance
  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}
