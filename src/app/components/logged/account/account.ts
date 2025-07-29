import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService, UserResponse, UserUpdateRequest } from '../../../service/user-requisition';

@Component({
  selector: 'app-account-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './account.html',
  styleUrl: './account.css'
})
export class Account implements OnInit {
  userId: number | null = null;
  
  userDetails: UserResponse | null = null;
  isLoading = false;
  errorMessage = '';
  isEditing = false;
  
  // Dados para edição
  editForm = {
    name: '',
    email: '',
    numberPhone: ''
  };

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadUserDetails();
  }

  loadUserDetails(): void {
    // Obter o ID da URL
    this.route.params.subscribe((params: any) => {
      const userId = +params['id']; // Converter para número
      
      if (!userId) {
        this.errorMessage = 'ID do usuário não encontrado na URL';
        return;
      }

      this.userId = userId;
      this.isLoading = true;
      this.errorMessage = '';

      this.userService.getUserDetails(userId).subscribe({
        next: (user) => {
          this.userDetails = user;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.message || 'Erro ao carregar dados do usuário';
          this.isLoading = false;
        }
      });
    });
  }

  startEditing(): void {
    if (this.userDetails) {
      this.editForm = {
        name: this.userDetails.name,
        email: this.userDetails.email,
        numberPhone: this.userDetails.numberPhone
      };
      this.isEditing = true;
    }
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.errorMessage = '';
  }

  saveChanges(): void {
    if (!this.userDetails) return;

    const updateData: UserUpdateRequest = {};
    
    // Adiciona apenas os campos que foram alterados
    if (this.editForm.name !== this.userDetails.name) {
      updateData.name = this.editForm.name;
    }
    if (this.editForm.email !== this.userDetails.email) {
      updateData.email = this.editForm.email;
    }
    if (this.editForm.numberPhone !== this.userDetails.numberPhone) {
      updateData.numberPhone = this.editForm.numberPhone;
    }

    // Se não há mudanças, apenas cancela a edição
    if (Object.keys(updateData).length === 0) {
      this.cancelEditing();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.userService.updateUser(this.userDetails.id, updateData).subscribe({
      next: (updatedUser) => {
        this.userDetails = {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          numberPhone: updatedUser.numberPhone
        };
        this.isEditing = false;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erro ao atualizar dados do usuário';
        this.isLoading = false;
      }
    });
  }

  validateForm(): boolean {
    if (!this.userService.isValidName(this.editForm.name)) {
      this.errorMessage = 'Nome deve ter pelo menos 3 caracteres';
      return false;
    }
    
    if (!this.userService.isValidEmail(this.editForm.email)) {
      this.errorMessage = 'Email inválido';
      return false;
    }
    
    if (!this.userService.isValidPhone(this.editForm.numberPhone)) {
      this.errorMessage = 'Telefone deve ter 10 ou 11 dígitos';
      return false;
    }
    
    return true;
  }

  onSaveClick(): void {
    if (this.validateForm()) {
      this.saveChanges();
    }
  }
}
