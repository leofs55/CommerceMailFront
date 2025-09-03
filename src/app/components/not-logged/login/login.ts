import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService, UserLoginRequest } from '../../../service/user-requisition';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  formData = {
    email: '',
    senha: '',
    lembrar: false
  };

  showPassword = false;
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

  // Método para alternar visibilidade da senha
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // Método para enviar o formulário
  onSubmit(): void {
    if (this.formData.email && this.formData.senha) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginRequest: UserLoginRequest = {
        email: this.formData.email,
        password: this.formData.senha
      };

      this.userService.login(loginRequest).subscribe({
        next: (response) => {
          console.log('Login realizado com sucesso:', response);
          this.isLoading = false;
          
          // Redirecionar para a página principal após login
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Erro no login:', error);
          this.isLoading = false;
          
          if (error.status === 500) {
            this.errorMessage = 'Email ou senha inválidos';
          } else if (error.status === 0) {
            this.errorMessage = 'Erro de conexão. Verifique se o servidor está rodando.';
          } else {
            this.errorMessage = 'Erro ao fazer login. Tente novamente.';
          }
        }
      });
    }
  }
}
