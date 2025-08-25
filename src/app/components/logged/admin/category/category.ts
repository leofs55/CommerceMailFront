import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService, CategoryResponse, CategoryCreateRequest } from '../../../../service/category-requisition';
import { UserService } from '../../../../service/user-requisition';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.html',
  styleUrl: './category.css'
})
export class Category implements OnInit {
  private categoryService = inject(CategoryService);
  private userService = inject(UserService);
  
  categories: CategoryResponse[] = [];
  filteredCategories: CategoryResponse[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  
  // Propriedades para o modal de delete
  showDeleteModal: boolean = false;
  showCreateModal: boolean = false;
  showEditModal: boolean = false;
  categoryToDelete: CategoryResponse | null = null;
  categoryToEdit: CategoryResponse | null = null;
  deleteLoading: boolean = false;
  createLoading: boolean = false;
  editLoading: boolean = false;

  newCategory: CategoryCreateRequest = {
    name: ''
  };

  editCategory: CategoryCreateRequest = {
    name: ''
  };

  ngOnInit(): void {
    // Validar se o usuário é admin antes de carregar a página
    if (!this.userService.checkAdminRoleAndRedirect('/')) {
      return;
    }
    
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

  onEditCategory(category: CategoryResponse): void {
    this.categoryToEdit = category;
    this.editCategory.name = category.name;
    this.showEditModal = true;
  }

  openCreateModal(): void {
    this.showCreateModal = true;
    this.newCategory.name = '';
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
    if (this.newCategory.name.trim()) {
      this.createLoading = true;
      this.categoryService.createCategory(this.newCategory).subscribe({
        next: (response) => {
          console.log('Categoria criada com sucesso:', response);
          this.closeCreateModal();
          this.loadCategories();
          this.createLoading = false;
        },
        error: (error) => {
          console.error('Erro ao criar categoria:', error);
          this.createLoading = false;
          alert('Erro ao criar categoria. Tente novamente.');
        }
      });
    }
  }

  updateCategory(): void {
    if (this.categoryToEdit && this.editCategory.name.trim()) {
      this.editLoading = true;
      this.categoryService.updateCategory(this.categoryToEdit.id, this.editCategory).subscribe({
        next: (response) => {
          console.log('Categoria atualizada com sucesso:', response);
          // Atualiza a categoria na lista local
          const index = this.categories.findIndex(c => c.id === this.categoryToEdit!.id);
          if (index !== -1) {
            this.categories[index] = { ...this.categories[index], name: this.editCategory.name };
            this.filterCategories();
          }
          this.closeEditModal();
          this.editLoading = false;
        },
        error: (error) => {
          console.error('Erro ao atualizar categoria:', error);
          this.editLoading = false;
          alert('Erro ao atualizar categoria. Tente novamente.');
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
    this.newCategory.name = '';
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.categoryToEdit = null;
    this.editCategory.name = '';
  }
}
