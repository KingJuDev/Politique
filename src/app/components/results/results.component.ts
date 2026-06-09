import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScoreResult, AnswerDetail } from '../../models/models';
import { UserStateService } from '../../services/user-state.service';
import { ScoreService } from '../../services/score.service';

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss'],
    standalone: false
})
export class ResultsComponent implements OnInit {

  scores: ScoreResult[] = [];
  totalTime = 0;
  numberOfAnswers = 0;
  expandedCandidateId: string | null = null;
  private detailsCache = new Map<string, AnswerDetail[]>();

  constructor(
    private userStateService: UserStateService,
    private scoreService: ScoreService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const userState = this.userStateService.getCurrentState();

    if (userState.answers.length === 0) {
      this.router.navigate(['/home']);
      return;
    }

    this.scores = this.scoreService.calculateScores(userState.answers);
    this.numberOfAnswers = userState.answers.length;
    this.totalTime = this.userStateService.getElapsedTime();

    this.scores.forEach(result => {
      this.detailsCache.set(
        result.candidateId,
        this.scoreService.getCandidateAnswerDetails(result.candidateId, userState.answers)
      );
    });
  }

  toggleCandidate(candidateId: string): void {
    this.expandedCandidateId = this.expandedCandidateId === candidateId ? null : candidateId;
  }

  getDetails(candidateId: string): AnswerDetail[] {
    return this.detailsCache.get(candidateId) ?? [];
  }

  countByAlignment(details: AnswerDetail[], type: 'agree' | 'neutral' | 'disagree'): number {
    if (type === 'agree') return details.filter(d => d.position > 0).length;
    if (type === 'neutral') return details.filter(d => d.position === 0).length;
    return details.filter(d => d.position < 0).length;
  }

  alignmentLabel(position: number): string {
    if (position >= 3) return 'Très favorable';
    if (position > 0) return 'Favorable';
    if (position === 0) return 'Neutre';
    if (position > -3) return 'Défavorable';
    return 'Très défavorable';
  }

  alignmentClass(position: number): string {
    if (position > 0) return 'agree';
    if (position === 0) return 'neutral';
    return 'disagree';
  }

  startAgain(): void {
    this.userStateService.resetState();
    this.router.navigate(['/home']);
  }

  /**
   * Récupère le score principal (le plus élevé)
   */
  getTopScore(): ScoreResult | null {
    return this.scores.length > 0 ? this.scores[0] : null;
  }

  /**
   * Formate le temps
   */
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  }

  /**
   * Récupère la classe CSS pour une barre de score
   */
  getScoreClass(percentage: number): string {
    if (percentage >= 75) return 'score-excellent';
    if (percentage >= 60) return 'score-good';
    if (percentage >= 40) return 'score-moderate';
    return 'score-low';
  }
}
