import { Component } from '@angular/core';
import { HeaderLogged } from '../../components/logged/header/header';
import { Feedback } from '../../components/logged/admin/feedback/feedback';

@Component({
  selector: 'app-admin-feedback',
  imports: [HeaderLogged, Feedback],
  templateUrl: './admin-feedback.html',
  styleUrl: './admin-feedback.css'
})
export class AdminFeedback {

}
