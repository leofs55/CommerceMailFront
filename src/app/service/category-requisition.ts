import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

// Interfaces baseadas no controller Spring Boot
export interface CategoryCreateRequest {
    name: string;
}

export interface CategoryCreateResponse {
    id: number;
    name: string;
}

export interface CategoryUpdateRequest {
    name?: string;
}

export interface CategoryUpdateResponse {
    id: number;
    name: string;
}

export interface CategoryResponse {
    id: number;
    name: string;
}

export interface CategoryDeleteResponse {
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private apiUrl = 'http://localhost:8080/api/v1/category';

    constructor(private http: HttpClient) {}

    // POST /api/v1/category/create
    createCategory(category: CategoryCreateRequest): Observable<CategoryCreateResponse> {
        return this.http.post<CategoryCreateResponse>(`${this.apiUrl}/create`, category);
    }

    // GET /api/v1/category/all
    getAllCategories(): Observable<CategoryResponse[]> {
        return this.http.get<CategoryResponse[]>(`${this.apiUrl}/all`);
    }

    // GET /api/v1/category/{id}
    getCategoryById(id: number): Observable<CategoryResponse> {
        return this.http.get<CategoryResponse>(`${this.apiUrl}/${id}`);
    }

    // PUT /api/v1/category/update/{id}
    updateCategory(id: number, category: CategoryUpdateRequest): Observable<CategoryUpdateResponse> {
        return this.http.put<CategoryUpdateResponse>(`${this.apiUrl}/update/${id}`, category);
    }

    // DELETE /api/v1/category/delete/{id}
    deleteCategory(id: number): Observable<CategoryDeleteResponse> {
        return this.http.delete<CategoryDeleteResponse>(`${this.apiUrl}/delete/${id}`);
    }
}