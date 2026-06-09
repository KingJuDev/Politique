import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuizLength } from '../../models/models';
import { UserStateService } from '../../services/user-state.service';
import { DataService } from '../../services/data.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent {

  selectedLength: QuizLength = 'medium';

  readonly quizModes: { length: QuizLength; label: string; questions: number; duration: string; description: string; icon: string }[] = [
    { length: 'short', label: 'Court', questions: 30, duration: '~10 min', description: 'Les questions essentielles', icon: '⚡' },
    { length: 'medium', label: 'Moyen', questions: 60, duration: '~20 min', description: 'Un panorama complet', icon: '📊' },
    { length: 'long', label: 'Long', questions: 90, duration: '~30 min', description: 'Analyse exhaustive', icon: '🔬' }
  ];

  constructor(
    private router: Router,
    private userStateService: UserStateService,
    private dataService: DataService
  ) {}

  get candidatesCount(): number {
    return this.dataService.getCandidates().length;
  }

  get themesCount(): number {
    return this.dataService.getThemes().length;
  }

  selectMode(length: QuizLength): void {
    this.selectedLength = length;
  }

  startQuiz(): void {
    this.userStateService.startProcess(this.selectedLength);
    this.router.navigate(['/themes']);
  }
}
