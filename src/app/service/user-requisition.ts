import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

// Interfaces baseadas no controller Spring Boot
export interface UserCreateRequest {
  name: string;
  email: string;
  numberPhone: string; // Corrigido de 'phone' para 'numberPhone'
  password: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserCreateResponse {
  name: string;
}

export interface UserLoginResponse {
  id: number;
  name: string;
  email: string;
  token: string;
}

export interface UserUpdateRequest {
  name?: string;
  email?: string;
  numberPhone?: string; // Corrigido de 'phone' para 'numberPhone'
  password?: string;
}

export interface UserUpdateResponse {
  id: number;
  name: string;
  email: string;
  numberPhone: string; // Corrigido de 'phone' para 'numberPhone'
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  numberPhone: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8080/api/v1/user';
  private tokenKey = 'auth_token';
  private userKey = 'user_data';
  
  // BehaviorSubject para gerenciar o estado do usuário logado
  private currentUserSubject = new BehaviorSubject<UserLoginResponse | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Função para criar usuário (sign-up)
  createUser(userData: UserCreateRequest): Observable<UserCreateResponse> {
    return this.http.post<UserCreateResponse>(`${this.apiUrl}/create`, userData)
      .pipe(
        tap(response => {}),
        catchError(this.handleError)
      );
  }

  // Função para fazer login
  login(credentials: UserLoginRequest): Observable<UserLoginResponse> {
    return this.http.post<UserLoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          // Armazenar token e dados do usuário
          this.storeToken(response.token);
          this.storeUser(response);
          this.currentUserSubject.next(response);
        }),
        catchError(this.handleError)
      );
  }

  // Função para atualizar usuário
  updateUser(userId: number, userData: UserUpdateRequest): Observable<UserUpdateResponse> {
    const headers = this.getAuthHeaders();
    return this.http.put<UserUpdateResponse>(`${this.apiUrl}/update/${userId}`, userData, { headers })
      .pipe(catchError(this.handleError));
  }

  // Função para obter detalhes do usuário
  getUserDetails(userId: number): Observable<UserResponse> {
    const headers = this.getAuthHeaders();
    return this.http.get<UserResponse>(`${this.apiUrl}/${userId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Função para fazer logout
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  // Função para verificar se o usuário está logado
  isLoggedIn(): boolean {
    return !!this.getStoredToken();
  }

  // Função para obter o token armazenado
  getStoredToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Função para obter os dados do usuário armazenados
  getStoredUser(): UserLoginResponse | null {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  // Função para obter o usuário atual
  getCurrentUser(): UserLoginResponse | null {
    return this.currentUserSubject.value;
  }

  // Função para criar headers de autenticação
  private getAuthHeaders(): HttpHeaders {
    const token = this.getStoredToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Função para armazenar token
  private storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Função para armazenar dados do usuário
  private storeUser(user: UserLoginResponse): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Função para tratar erros HTTP
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      return throwError(() => new Error('Servidor não está rodando. Verifique se o Spring Boot está iniciado na porta 8080.'));
    }
    
    if (error.status === 404) {
      return throwError(() => new Error('Endpoint não encontrado. Verifique se a URL está correta.'));
    }
    
    if (error.status === 403) {
      return throwError(() => new Error('Acesso negado. Verifique a configuração de CORS no backend.'));
    }
    
    return throwError(() => new Error(`Erro ${error.status}: ${error.message}`));
  }

  // Função para validar email
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Função para validar telefone
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone);
  }

  // Função para validar senha
  isValidPassword(password: string): boolean {
    return password.length >= 6;
  }

  // Função para validar nome
  isValidName(name: string): boolean {
    return name.length >= 3;
  }

  // Função para testar conexão com o servidor
  testConnection(): Observable<any> {
    return this.http.get(`${this.apiUrl}/create`)
      .pipe(catchError(this.handleError));
  }
}