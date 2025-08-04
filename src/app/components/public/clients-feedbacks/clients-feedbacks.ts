import { Component } from '@angular/core';
import { FeedbackResponse, FeedbackService } from '../../../service/feedback-requisition';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-clients-feedbacks',
  imports: [CommonModule],
  templateUrl: './clients-feedbacks.html',
  styleUrl: './clients-feedbacks.css'
})
export class ClientsFeedbacks {
  feedbacks: any[] = [];
  currentSlide: number = 0;
  maxSlides: number = 0;
  totalSlides: number = 0;
  itemsPerSlide: number = 3;

  constructor(private feedbackService: FeedbackService) {
    this.loadFeedbacks();
  }

  repeatStars(rating: number): string {
    const estrela: string = '★';
    return estrela.repeat(rating);
  }
  
  loadFeedbacks() {
    this.feedbackService.getAllFeedbacks().subscribe(feedbacks => {
      this.feedbacks = feedbacks;
      this.calculateSlides();
    });
  }

  calculateSlides() {
    // Para um carrossel simples, vamos mostrar 3 itens por vez
    this.totalSlides = Math.max(1, Math.ceil(this.feedbacks.length / this.itemsPerSlide));
    this.maxSlides = Math.max(0, this.totalSlides - 1);
  }

  nextSlide() {
    if (this.currentSlide < this.maxSlides) {
      this.currentSlide++;
    }
  }

  previousSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  goToSlide(slideIndex: number) {
    if (slideIndex >= 0 && slideIndex <= this.maxSlides) {
      this.currentSlide = slideIndex;
    }
  }
}
