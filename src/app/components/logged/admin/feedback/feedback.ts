import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedbackService, FeedbackResponse } from '../../../../service/feedback-requisition';

@Component({
  selector: 'app-feedback',
  standalone: true,
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
  
  // Variáveis para o modal de confirmação
  showDeleteModal: boolean = false;
  feedbackToDelete: FeedbackResponse | null = null;
  deleting: boolean = false;

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

  // Abrir modal de confirmação
  openDeleteModal(feedback: FeedbackResponse): void {
    this.feedbackToDelete = feedback;
    this.showDeleteModal = true;
  }

  // Fechar modal de confirmação
  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.feedbackToDelete = null;
    this.deleting = false;
  }

  // Confirmar e executar a deleção
  confirmDelete(): void {
    if (!this.feedbackToDelete) return;

    this.deleting = true;
    this.feedbackService.deleteFeedback(this.feedbackToDelete.id).subscribe({
      next: (response) => {
        console.log('Feedback deletado com sucesso:', response.message);
        // Remover o feedback da lista
        this.feedbacks = this.feedbacks.filter(f => f.id !== this.feedbackToDelete!.id);
        this.filteredFeedbacks = this.filteredFeedbacks.filter(f => f.id !== this.feedbackToDelete!.id);
        this.closeDeleteModal();
      },
      error: (error) => {
        console.error('Erro ao deletar feedback:', error);
        this.deleting = false;
        // Aqui você pode adicionar uma notificação de erro para o usuário
      }
    });
  }
}
