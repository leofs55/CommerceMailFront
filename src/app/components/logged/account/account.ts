import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService, UserResponse, UserUpdateRequest, UserLoginResponse } from '../../../service/user-requisition';

@Component({
  selector: 'app-account-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './account.html',
  styleUrl: './account.css'
})
export class Account implements OnInit {
  userId: number | null = null;
  
  userDetails: UserResponse | null = null;
  currentUser: UserLoginResponse | null = null;
  isLoading = false;
  errorMessage = '';
  
  // Propriedades para mostrar/ocultar senhas
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  
  // Dados para edição
  editForm = {
    name: '',
    email: '',
    numberPhone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
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
      
      // Obter dados do usuário logado
      this.currentUser = this.userService.getCurrentUser();
      
      if (!this.currentUser) {
        this.errorMessage = 'Usuário não está logado';
        return;
      }

      // Verificar se o ID da URL corresponde ao usuário logado
      if (this.currentUser.id !== userId) {
        this.errorMessage = 'Acesso negado: ID não corresponde ao usuário logado';
        return;
      }

      this.isLoading = true;
      this.errorMessage = '';

      this.userService.getUserDetails(userId).subscribe({
        next: (user) => {
          this.userDetails = user;
          // Preencher o formulário automaticamente
          this.editForm = {
            name: user.name,
            email: user.email,
            numberPhone: user.numberPhone,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          };
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.message || 'Erro ao carregar dados do usuário';
          this.isLoading = false;
        }
      });
    });
  }

  saveChanges(): void {
    if (!this.userDetails) return;

    // Validar se a senha atual foi fornecida
    if (!this.editForm.currentPassword) {
      this.errorMessage = 'Digite sua senha atual para confirmar as alterações';
      return;
    }

    const updateData: UserUpdateRequest = {};
    
    // Adiciona apenas os campos que foram alterados
    updateData.name = this.editForm.name;
    updateData.email = this.editForm.email;
    updateData.numberPhone = this.editForm.numberPhone;
    updateData.password = this.editForm.currentPassword;
  
    // Se uma nova senha foi fornecida, validar e incluir
    if (this.editForm.newPassword) {
      if (this.editForm.currentPassword === this.editForm.newPassword) {
        this.errorMessage = 'A nova senha não pode ser igual à senha atual';
        return;
      }
      if (this.editForm.newPassword !== this.editForm.confirmPassword) {
        this.errorMessage = 'As senhas não coincidem';
        return;
      }
      if (!this.userService.isValidPassword(this.editForm.newPassword)) {
        this.errorMessage = 'A nova senha deve ter pelo menos 6 caracteres';
        return;
      }
      updateData.password = this.editForm.newPassword;
    }

    // Se não há mudanças, apenas retorna
    if (Object.keys(updateData).length === 0) {
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
        this.isLoading = false;
        
        // Limpar senhas após sucesso
        this.editForm.currentPassword = '';
        this.editForm.newPassword = '';
        this.editForm.confirmPassword = '';
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

    // Validar senha atual (obrigatória para qualquer alteração)
    if (!this.editForm.currentPassword) {
      this.errorMessage = 'Digite sua senha atual para confirmar as alterações';
      return false;
    }

    // Validar senhas se uma nova senha foi fornecida
    if (this.editForm.newPassword) {
      if (!this.userService.isValidPassword(this.editForm.newPassword)) {
        this.errorMessage = 'A nova senha deve ter pelo menos 6 caracteres';
        return false;
      }
      
      if (this.editForm.newPassword !== this.editForm.confirmPassword) {
        this.errorMessage = 'As senhas não coincidem';
        return false;
      }
    }
    
    return true;
  }

  onSaveClick(): void {
    if (this.validateForm()) {
      this.saveChanges();
    }
  }

  togglePassword(field: string): void {
    switch (field) {
      case 'currentPassword':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'newPassword':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirmPassword':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }
}
