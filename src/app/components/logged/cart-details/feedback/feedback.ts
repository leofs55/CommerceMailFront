import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Feedback {
  description: string;
  rating: number;
}

interface Cart {
  id: string;
  status: string;
  feedback?: Feedback;
}

interface FeedbackForm {
  description: string;
  rating: number;
}

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback.html',
  styleUrls: ['./feedback.css']
})
export class FeedbackComponent {
  @Input() cart: Cart | null = null;
  @Output() feedbackSubmitted = new EventEmitter<Feedback>();
  @Output() feedbackUpdated = new EventEmitter<Feedback>();
  @Output() feedbackCancelled = new EventEmitter<void>();
  feedbackForm: FeedbackForm = {
    description: '',
    rating: 0
  };

  isEditing = false;

  startEditing() {
    if (this.cart?.feedback) {
      this.feedbackForm.description = this.cart.feedback.description;
      this.feedbackForm.rating = this.cart.feedback.rating;
      this.isEditing = true;
    }
  }

  cancelEditing() {
    this.isEditing = false;
    this.feedbackForm = {
      description: '',
      rating: 5
    };
    this.feedbackCancelled.emit();
  }

  submitFeedback() {
    if (this.feedbackForm.description && this.feedbackForm.rating) {
      this.feedbackSubmitted.emit({
        description: this.feedbackForm.description,
        rating: this.feedbackForm.rating
      });
      
      // Reset form
      this.feedbackForm = {
        description: '',
        rating: 5
      };
    }
  }

  updateFeedback() {
    if (this.feedbackForm.description && this.feedbackForm.rating) {
      this.feedbackUpdated.emit({
        description: this.feedbackForm.description,
        rating: this.feedbackForm.rating
      });
      
      this.isEditing = false;
      this.feedbackForm = {
        description: '',
        rating: 5
      };
    }
  }

  getRatingStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }
}

