import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, UserResponse, UserUpdateRequest } from '../../../../service/user-requisition';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit {
  private userService = inject(UserService);
  
  users: UserResponse[] = [];
  filteredUsers: UserResponse[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  
  // Propriedades para o modal de edição
  showEditModal: boolean = false;
  editingUser: UserUpdateRequest = {
    name: '',
    email: '',
    numberPhone: '',
    password: ''
  };
  isUpdating: boolean = false;
  currentUserId: number | null = null;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getAllUsers().subscribe({
      next: (users: UserResponse[]) => {
        this.users = users;
        this.filteredUsers = users;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Erro ao carregar usuários: ' + error.message;
        this.isLoading = false;
      }
    });
  }

  filterUsers(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter(user =>
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  onSearchChange(): void {
    this.filterUsers();
  }

  openEditModal(user: UserResponse): void {
    this.currentUserId = user.id;
    this.editingUser = {
      name: user.name,
      email: user.email,
      numberPhone: user.numberPhone,
      password: '' // Senha em branco por padrão
    };
    this.showEditModal = true;
    this.errorMessage = '';
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.resetEditingUser();
  }

  private resetEditingUser(): void {
    this.editingUser = {
      name: '',
      email: '',
      numberPhone: '',
      password: ''
    };
    this.currentUserId = null;
    this.errorMessage = '';
    this.isUpdating = false;
  }

  updateUser(): void {
    if (!this.currentUserId) {
      this.errorMessage = 'ID do usuário não encontrado';
      return;
    }

    // Verifica se os campos obrigatórios estão preenchidos
    if (!this.editingUser.name?.trim() || !this.editingUser.email?.trim() || !this.editingUser.numberPhone?.trim()) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios';
      return;
    }

    // Remove campos vazios para não enviar dados desnecessários
    const updateData: UserUpdateRequest = {};
    updateData.name = this.editingUser.name!.trim();
    updateData.email = this.editingUser.email!.trim();
    updateData.numberPhone = this.editingUser.numberPhone!.trim();
    if (this.editingUser.password && this.editingUser.password.trim()) {
      updateData.password = this.editingUser.password.trim();
    }

    this.isUpdating = true;
    this.errorMessage = '';

    this.userService.updateUser(this.currentUserId, updateData).subscribe({
      next: (response) => {
        // Atualiza a lista de usuários
        this.loadUsers();
        this.closeEditModal();
      },
      error: (error: any) => {
        this.errorMessage = 'Erro ao atualizar usuário: ' + error.message;
        this.isUpdating = false;
      }
    });
  }
}
