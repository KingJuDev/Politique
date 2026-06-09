import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Question, UserAnswer, SKIP_OPTION_ID } from '../../models/models';
import { DataService } from '../../services/data.service';
import { UserStateService } from '../../services/user-state.service';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit, OnDestroy {

  selectedThemes: string[] = [];
  allQuestions: Question[] = [];
  currentQuestionIndex = 0;
  currentQuestion: Question | null = null;
  selectedAnswers: Map<string, string> = new Map();
  elapsedTime = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private dataService: DataService,
    public userStateService: UserStateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.selectedThemes = this.userStateService.getSelectedThemes();
    this.loadQuestions();

    // Mettre à jour le timer toutes les secondes
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.elapsedTime = this.userStateService.getElapsedTime();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Charge les questions pour les thèmes sélectionnés
   */
  private shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  private loadQuestions(): void {
    const quizLength = this.userStateService.getQuizLength();
    this.allQuestions = this.dataService.getQuestionsForQuiz(quizLength, this.selectedThemes)
      .map(q => ({ ...q, options: this.shuffle(q.options) }));

    // Charger les réponses existantes
    this.userStateService.getAnswers().forEach(answer => {
      this.selectedAnswers.set(answer.questionId, answer.optionId);
    });

    if (this.allQuestions.length > 0) {
      this.showQuestion(0);
    }
  }

  /**
   * Affiche une question
   */
  private showQuestion(index: number): void {
    if (index >= 0 && index < this.allQuestions.length) {
      this.currentQuestionIndex = index;
      this.currentQuestion = this.allQuestions[index];
    }
  }

  /**
   * Sélectionne une réponse
   */
  selectAnswer(optionId: string): void {
    if (this.currentQuestion) {
      this.selectedAnswers.set(this.currentQuestion.id, optionId);

      // Enregistrer la réponse dans le service
      const answer: UserAnswer = {
        questionId: this.currentQuestion.id,
        optionId: optionId,
        themeId: this.currentQuestion.themeId
      };
      this.userStateService.addAnswer(answer);

      // Avancer automatiquement à la prochaine question après un petit délai
      setTimeout(() => {
        this.nextQuestion();
      }, 300);
    }
  }

  /**
   * Va à la question précédente
   */
  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.showQuestion(this.currentQuestionIndex - 1);
    }
  }

  /**
   * Va à la question suivante
   */
  nextQuestion(): void {
    if (this.currentQuestionIndex < this.allQuestions.length - 1) {
      this.showQuestion(this.currentQuestionIndex + 1);
    } else {
      // Fin du quiz
      this.completeQuiz();
    }
  }

  /**
   * Complète le quiz
   */
  private completeQuiz(): void {
    this.userStateService.completeProcess();
    this.router.navigate(['/results']);
  }

  skipQuestion(): void {
    if (this.currentQuestion) {
      this.selectedAnswers.set(this.currentQuestion.id, SKIP_OPTION_ID);
      const answer: UserAnswer = {
        questionId: this.currentQuestion.id,
        optionId: SKIP_OPTION_ID,
        themeId: this.currentQuestion.themeId
      };
      this.userStateService.addAnswer(answer);
      setTimeout(() => this.nextQuestion(), 300);
    }
  }

  isSkipped(): boolean {
    return this.getSelectedAnswer() === SKIP_OPTION_ID;
  }

  getSelectedAnswer(): string | undefined {
    if (this.currentQuestion) {
      return this.selectedAnswers.get(this.currentQuestion.id);
    }
    return undefined;
  }

  isAnswered(): boolean {
    return !!this.getSelectedAnswer();
  }

  /**
   * Calcule la progression
   */
  getProgress(): number {
    if (this.allQuestions.length === 0) {
      return 0;
    }
    return Math.round(((this.currentQuestionIndex + 1) / this.allQuestions.length) * 100);
  }

  /**
   * Revient à la sélection des thèmes
   */
  goBack(): void {
    if (this.currentQuestionIndex > 0) {
      this.previousQuestion();
    } else {
      this.router.navigate(['/themes']);
    }
  }

  /**
   * Quitte le quiz
   */
  quit(): void {
    if (confirm('Êtes-vous sûr de vouloir quitter le quiz? Vos réponses seront perdues.')) {
      this.userStateService.resetState();
      this.router.navigate(['/home']);
    }
  }
}
