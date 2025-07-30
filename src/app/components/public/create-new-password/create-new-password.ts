import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../service/user-requisition';

// Interface baseada no DTO Java
interface UserResetPasswordRequest {
  password: string;
}

@Component({
  selector: 'app-create-new-password-component',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-new-password.html',
  styleUrl: './create-new-password.css'
})
export class CreateNewPassword implements OnInit {
  resetForm!: FormGroup;
  isSubmitted = false;
  serverResponse = '';
  userId: string | null = null;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getUserIdFromUrl();
  }

  private getUserIdFromUrl(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    console.log('🔍 User ID da URL:', this.userId);
  }

  private initForm(): void {
    this.resetForm = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordStrengthValidator()
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Validador de força da senha baseado no regex do DTO Java
  private passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;
      if (!password) return null;

      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /[0-9]/.test(password);
      const hasSpecialChar = /[!@#$%^&*()_+={}\[\]|:;"'<>,.?/~`]/.test(password);

      if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
        return { passwordStrength: true };
      }

      return null;
    };
  }

  // Validador para confirmar senha
  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.resetForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // Limpar mensagens quando o usuário começar a digitar
  onInputChange(): void {
    if (this.serverResponse) {
      this.serverResponse = '';
    }
    if (this.isSubmitted) {
      this.isSubmitted = false;
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getPasswordStrengthClass(): string {
    const password = this.resetForm.get('password')?.value;
    if (!password) return '';

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+={}\[\]|:;"'<>,.?/~`]/.test(password);
    const hasMinLength = password.length >= 8;

    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar, hasMinLength]
      .filter(Boolean).length;

    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrengthClass();
    switch (strength) {
      case 'weak': return 'Senha fraca';
      case 'medium': return 'Senha média';
      case 'strong': return 'Senha forte';
      default: return '';
    }
  }

  onSubmit(): void {
    console.log('🎯 Método onSubmit() chamado!');
    console.log('🎯 Formulário válido:', this.resetForm.valid);
    console.log('🎯 Formulário inválido:', this.resetForm.invalid);
    console.log('🎯 Erros do formulário:', this.resetForm.errors);
    console.log('🎯 Valores do formulário:', this.resetForm.value);
    
    if (this.resetForm.invalid) {
      console.log('❌ Formulário inválido, marcando campos como touched');
      this.markFormGroupTouched();
      return;
    }

    if (!this.userId) {
      this.serverResponse = 'ID do usuário não encontrado na URL';
      return;
    }

    this.isSubmitted = true;
    this.serverResponse = '';

    const formData = this.resetForm.value;
    
    // Criar objeto no formato correto do DTO Java
    const resetRequest: UserResetPasswordRequest = {
      password: formData.password
    };

    console.log('🚀 Enviando requisição para redefinir senha:', resetRequest);
    console.log('👤 User ID:', this.userId);
    
    this.userService.resetPasswordWithId(this.userId, resetRequest).subscribe({
      next: (response: any) => {
        console.log('✅ Resposta recebida:', response);
        console.log('✅ Tipo da resposta:', typeof response);
        console.log('✅ Conteúdo da resposta:', JSON.stringify(response));
        
        // Mostrar a resposta do servidor como resultado
        console.log('✅ Resposta do servidor:', response);
        this.serverResponse = response || 'Resposta vazia do servidor';
        
        // Se sucesso, redirecionar para login após 3 segundos
        if (response && typeof response === 'string' && response.includes('Email enviado com sucesso!')) {
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        }
      },
      error: (error: any) => {
        console.error('❌ Erro no componente:', error);
        console.error('❌ Status do erro:', error.status);
        console.error('❌ Mensagem do erro:', error.message);
        
        // Mostrar erro na interface
        if (error.status === 0) {
          this.serverResponse = 'Servidor não está rodando. Verifique se o backend está iniciado.';
        } else if (error.status === 404) {
          this.serverResponse = 'Endpoint não encontrado. Verifique a configuração da API.';
        } else if (error.status === 403) {
          this.serverResponse = 'Acesso negado. Verifique a configuração de CORS.';
        } else if (error.error && error.error.message) {
          this.serverResponse = error.error.message;
        } else {
          this.serverResponse = 'Erro ao redefinir senha. Tente novamente.';
        }
        
        // Resetar estado de submissão
        this.isSubmitted = false;
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.resetForm.controls).forEach(key => {
      const control = this.resetForm.get(key);
      control?.markAsTouched();
    });
  }
}
