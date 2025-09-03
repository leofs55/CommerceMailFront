import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://ec2-18-117-12-169.us-east-2.compute.amazonaws.com:8080/api/v1/product'; // ajuste a URL conforme necessário
  private apiUrlImage = 'http://ec2-18-117-12-169.us-east-2.compute.amazonaws.com:8080/api/v1/upload'; // ajuste a URL conforme necessário
  
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
    formData.append('productImg', file);
    
    // Endpoint para upload de imagem com ID do produto
    // A API retorna uma string simples, não JSON
    return this.http.post(`${this.apiUrlImage}/create`, formData, { responseType: 'text' });
  }

  uploadUpdateImage(file: File, imgName: string): Observable<any> {
    const formData = new FormData();
    formData.append('productImg', file);
    formData.append('imgName', imgName);
    
    // Endpoint para upload de imagem com ID do produto
    // A API retorna uma string simples, não JSON
    return this.http.post(`${this.apiUrlImage}/create`, formData, { responseType: 'text' });
  }

  getImage(imgName: string): Observable<any> {
    // A API retorna a imagem como base64 ou blob
    return this.http.get(`http://ec2-18-117-12-169.us-east-2.compute.amazonaws.com:8080/api/v1/image/product/${imgName}`, { responseType: 'blob' });
  }

  getProductsByCategory(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'/category/'+categoryId);
  }
}