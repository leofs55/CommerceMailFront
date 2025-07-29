import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService, UserCreateRequest } from '../../../service/user-requisition';

@Component({
  selector: 'app-sign-up',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
})
export class SignUp {
  formData = {
    nome: '',
    email: '',
    numero: '',
    senha: '',
    senha2: ''
  };

  showPassword = false;
  showPassword2 = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  // Método para validar email
  isValidEmail(email: string): boolean {
    return this.userService.isValidEmail(email);
  }

  // Método para validar telefone
  isValidPhone(phone: string): boolean {
    return this.userService.isValidPhone(phone);
  }

  // Método para verificar se as senhas coincidem
  senhasCoincidem(): boolean {
    return this.formData.senha === this.formData.senha2 && this.formData.senha !== '';
  }

  // Getter para verificar se as senhas não coincidem
  get senhasNaoCoincidem(): boolean {
    return this.formData.senha2 !== '' && !this.senhasCoincidem();
  }

  // Método para alternar visibilidade da senha
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // Método para alternar visibilidade da confirmação de senha
  togglePassword2(): void {
    this.showPassword2 = !this.showPassword2;
  }

  // Método para enviar o formulário
  onSubmit(): void {
    if (this.senhasCoincidem()) {
      this.isLoading = true;
      this.errorMessage = '';

      const createRequest: UserCreateRequest = {
        name: this.formData.nome,
        email: this.formData.email,
        numberPhone: this.formData.numero, // Corrigido de 'phone' para 'numberPhone'
        password: this.formData.senha
      };

      this.userService.createUser(createRequest).subscribe({
        next: (response) => {
          console.log('Usuário cadastrado com sucesso:', response);
          this.isLoading = false;
          
          // Redirecionar para login após cadastro bem-sucedido
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Erro ao cadastrar:', error);
          this.isLoading = false;
          
          // Mensagens de erro mais específicas
          if (error.status === 0) {
            this.errorMessage = 'Servidor não está rodando. Verifique se o Spring Boot está iniciado na porta 8080.';
          } else if (error.status === 404) {
            this.errorMessage = 'Endpoint não encontrado. Verifique se a URL está correta.';
          } else if (error.status === 403) {
            this.errorMessage = 'Acesso negado. Verifique a configuração de CORS no backend.';
          } else if (error.status === 400) {
            this.errorMessage = 'Dados inválidos. Verifique as informações fornecidas.';
          } else if (error.status === 409) {
            this.errorMessage = 'Email já cadastrado. Use outro email ou faça login.';
          } else {
            this.errorMessage = `Erro ao cadastrar: ${error.message}`;
          }
        }
      });
    }
  }
}
