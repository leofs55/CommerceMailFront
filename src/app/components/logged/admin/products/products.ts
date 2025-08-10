import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../service/product-requisition';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  grams: number;
  categoryResponse: Category;
  imgUrl?: string;
}

interface Category {
  id: number;
  name: string;
}

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
  categories: Category[] = [];
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
  
  // Propriedades de loading
  loading: boolean = false;

  // Dados mock para fallback em caso de erro na API

  constructor(private productService: ProductService) {}

  ngOnInit() {
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
        
        // Extrair categorias únicas dos produtos
        this.loadCategories();
        
        // Aplicar filtros e paginação
        this.filterProducts();
      },
      error: (error: any) => {
        console.error('Erro ao carregar produtos:', error);
        // Em caso de erro, usar dados mock como fallback
        this.loadCategories();
        this.filterProducts();
      }
    });
  }

  loadCategories() {
    // Extrair categorias únicas dos produtos carregados
    const uniqueCategories = new Map<number, { id: number; name: string }>();
    
    this.products.forEach(product => {
      if (product.categoryResponse && !uniqueCategories.has(product.categoryResponse.id)) {
        uniqueCategories.set(product.categoryResponse.id, product.categoryResponse);
      }
    });
    
    this.categories = Array.from(uniqueCategories.values());
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
    // TODO: Implementar modal de criação
    console.log('Abrir modal de criação');
  }

  viewProduct(product: Product) {
    // TODO: Implementar visualização detalhada
    console.log('Visualizar produto:', product);
  }

  editProduct(product: Product) {
    // TODO: Implementar edição
    console.log('Editar produto:', product);
  }

  deleteProduct(product: Product) {
    this.productToDelete = product;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.productToDelete) {
      // TODO: Implementar exclusão via API
      console.log('Excluir produto:', this.productToDelete);
      this.products = this.products.filter(p => p.id !== this.productToDelete!.id);
      this.filterProducts();
      this.closeDeleteModal();
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
    // TODO: Implementar exclusão em massa
    console.log('Excluir produtos selecionados:', this.selectedProducts);
    this.products = this.products.filter(p => !this.selectedProducts.includes(p.id));
    this.selectedProducts = [];
    this.filterProducts();
  }



  // Método de tracking para performance
  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}
