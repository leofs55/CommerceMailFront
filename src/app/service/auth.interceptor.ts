import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (request, next) => {
  // Obter o token do localStorage
  const token = localStorage.getItem('auth_token');

  // Se existe um token, adicionar ao header Authorization
  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request);
}; 