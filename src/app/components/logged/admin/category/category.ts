import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService, CategoryResponse, CategoryCreateRequest } from '../../../../service/category-requisition';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.html',
  styleUrl: './category.css'
})
export class Category implements OnInit {
  private categoryService = inject(CategoryService);
  
  categories: CategoryResponse[] = [];
  filteredCategories: CategoryResponse[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  
  // Propriedades para o modal de delete
  showDeleteModal: boolean = false;
  showCreateModal: boolean = false;
  categoryToDelete: CategoryResponse | null = null;
  deleteLoading: boolean = false;
  createLoading: boolean = false;

  newCategory: CategoryCreateRequest = {
    name: ''
  };

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.filteredCategories = categories;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
        this.isLoading = false;
      }
    });
  }

  filterCategories(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCategories = this.categories;
    } else {
      this.filteredCategories = this.categories.filter(category =>
        category.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  onDeleteCategory(category: CategoryResponse): void {
    this.categoryToDelete = category;
    this.showDeleteModal = true;
  }

  openCreateModal(): void {
    this.showCreateModal = true;
  }

  confirmDelete(): void {
    if (this.categoryToDelete) {
      this.deleteLoading = true;
      this.categoryService.deleteCategory(this.categoryToDelete.id).subscribe({
        next: (response) => {
          console.log('Categoria deletada com sucesso:', response.message);
          // Remove a categoria da lista local
          this.categories = this.categories.filter(c => c.id !== this.categoryToDelete!.id);
          this.filterCategories();
          this.closeDeleteModal();
          this.deleteLoading = false;
        },
        error: (error) => {
          console.error('Erro ao deletar categoria:', error);
          this.deleteLoading = false;
          alert('Erro ao deletar categoria. Tente novamente.');
        }
      });
    }
  }

  createCategory(): void {
    if (this.newCategory.name) {
      this.categoryService.createCategory(this.newCategory).subscribe({
        next: (response) => {
          console.log('Categoria criada com sucesso:', response);
          this.closeCreateModal();
          this.loadCategories();
        },
        error: (error) => {
          console.error('Erro ao criar categoria:', error);
          alert('Erro ao criar categoria. Tente novamente.');
        }
      });
    }
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.categoryToDelete = null;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  onEditCategory(categoryId: number): void {
    // Função de editar será implementada posteriormente
    console.log('Editar categoria com ID:', categoryId);
  }
}
