import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService, UserResetPasswordConfirmationRequest } from '../../../service/user-requisition';

@Component({
  selector: 'app-reset-password-component',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit {
  resetForm!: FormGroup;
  isSubmitted = false;
  serverResponse = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
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



  onSubmit(): void {
    if (this.resetForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitted = true;
    this.serverResponse = '';

    const formData = this.resetForm.value;
    
    // Criar objeto no formato correto do DTO Java
    const resetRequest: UserResetPasswordConfirmationRequest = {
      email: formData.email
    };

    console.log('🚀 Enviando requisição para redefinição de senha:', resetRequest);
    
    this.userService.resetPassword(resetRequest).subscribe({
      next: (response) => {
        console.log('✅ Resposta recebida:', response);
        console.log('✅ Tipo da resposta:', typeof response);
        console.log('✅ Conteúdo da resposta:', JSON.stringify(response));
        
        // Mostrar a resposta do servidor como resultado
        console.log('✅ Resposta do servidor:', response);
        this.serverResponse = response || 'Resposta vazia do servidor';
        this.resetForm.reset();
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
