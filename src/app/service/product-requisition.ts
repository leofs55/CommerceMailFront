import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/v1/product'; // ajuste a URL conforme necessário

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'/all');
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<any>(this.apiUrl+'/'+id);
  }

  createProduct(product: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+'/create', product);
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put<any>(this.apiUrl+'/update/'+id, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(this.apiUrl+'/'+id);
  }

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    
    // Endpoint para upload de imagem
    return this.http.post<any>(this.apiUrl + '/upload-image', formData);
  }

  getProductsByCategory(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'/category/'+categoryId);
  }
}