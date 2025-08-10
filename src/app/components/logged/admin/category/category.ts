import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService, CategoryResponse } from '../../../../service/category-requisition';

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

  onDeleteCategory(categoryId: number): void {
    // Função de deletar será implementada posteriormente
    console.log('Deletar categoria com ID:', categoryId);
  }

  onEditCategory(categoryId: number): void {
    // Função de editar será implementada posteriormente
    console.log('Editar categoria com ID:', categoryId);
  }

  onViewCategory(categoryId: number): void {
    // Função de visualizar será implementada posteriormente
    console.log('Visualizar categoria com ID:', categoryId);
  }
}
