import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedbackService, FeedbackResponse } from '../../../../service/feedback-requisition';

@Component({
  selector: 'app-feedback',
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback.html',
  styleUrl: './feedback.css'
})
export class Feedback implements OnInit {
  private feedbackService = inject(FeedbackService);
  
  feedbacks: FeedbackResponse[] = [];
  filteredFeedbacks: FeedbackResponse[] = [];
  searchUserId: string = '';
  loading: boolean = false;

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
    this.loading = true;
    this.feedbackService.getAllFeedbacks().subscribe({
      next: (data) => {
        this.feedbacks = data;
        this.filteredFeedbacks = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar feedbacks:', error);
        this.loading = false;
      }
    });
  }

  searchByUserId(): void {
    if (!this.searchUserId.trim()) {
      this.filteredFeedbacks = this.feedbacks;
      return;
    }

    const userId = parseInt(this.searchUserId);
    if (!isNaN(userId)) {
      this.filteredFeedbacks = this.feedbacks.filter(
        feedback => feedback.user.id === userId
      );
    } else {
      this.filteredFeedbacks = [];
    }
  }

  clearSearch(): void {
    this.searchUserId = '';
    this.filteredFeedbacks = this.feedbacks;
  }

  deleteFeedback(feedbackId: number): void {
    // Função será implementada posteriormente
    console.log('Deletar feedback com ID:', feedbackId);
  }
}
