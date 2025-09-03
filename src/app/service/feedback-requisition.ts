import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { UserResponse } from "./user-requisition";
import { Injectable } from "@angular/core";

export interface FeedbackCreateRequest {
    description: string;
    rating: number;
    userId: number;
    cartId: string;
}

export interface FeedbackCreateResponse {
    id: number;
    description: string;
    rating: number;
}

export interface FeedbackUpdateRequest {
    description: string;
    rating: number;
    userId: number;
    cartId: string;
}

export interface FeedbackUpdateResponse {
    id: number;
    description: string;
    rating: number;
}

export interface FeedbackResponse {
    id: number;
    description: string;
    rating: number;
    cartId: string;
    userId: number;
    userResponse: UserResponse;
}

export interface FeedbackDeleteResponse {
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class FeedbackService {
    private apiUrl = 'http://ec2-18-117-12-169.us-east-2.compute.amazonaws.com:8080/api/v1/feedback';

    constructor(private http: HttpClient) {}

    createFeedback(feedback: FeedbackCreateRequest): Observable<FeedbackCreateResponse> {
        return this.http.post<FeedbackCreateResponse>(`${this.apiUrl}/create`, feedback);
    }

    updateFeedback(feedback: FeedbackUpdateRequest): Observable<FeedbackUpdateResponse> {
        return this.http.put<FeedbackUpdateResponse>(`${this.apiUrl}/update`, feedback);
    }

    getFeedbackById(cartId: string): Observable<FeedbackResponse> {
        return this.http.get<FeedbackResponse>(`${this.apiUrl}/${cartId}`);
    }

    deleteFeedback(id: number): Observable<FeedbackDeleteResponse> {
        return this.http.delete<FeedbackDeleteResponse>(`${this.apiUrl}/delete/${id}`);
    }
    
    getAllFeedbacks(): Observable<FeedbackResponse[]> {
        return this.http.get<FeedbackResponse[]>(`${this.apiUrl}/all`);
    }
}
