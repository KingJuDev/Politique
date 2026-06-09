import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserState, UserAnswer, QuizLength } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {

  private userState: UserState = this.defaultState();

  private userStateSubject = new BehaviorSubject<UserState>(this.userState);
  public userState$: Observable<UserState> = this.userStateSubject.asObservable();

  constructor() {}

  private defaultState(): UserState {
    return {
      quizLength: 'medium',
      selectedThemes: [],
      answers: [],
      startTime: 0,
      completed: false
    };
  }

  setQuizLength(length: QuizLength): void {
    this.userState.quizLength = length;
    this.updateState();
  }

  getQuizLength(): QuizLength {
    return this.userState.quizLength;
  }

  startProcess(length?: QuizLength): void {
    const currentLength = length ?? this.userState.quizLength;
    this.userState = {
      ...this.defaultState(),
      quizLength: currentLength,
      startTime: Date.now()
    };
    this.updateState();
  }

  resetState(): void {
    this.userState = this.defaultState();
    this.updateState();
  }

  selectTheme(themeId: string): void {
    if (!this.userState.selectedThemes.includes(themeId)) {
      this.userState.selectedThemes.push(themeId);
      this.updateState();
    }
  }

  deselectTheme(themeId: string): void {
    this.userState.selectedThemes = this.userState.selectedThemes.filter(t => t !== themeId);
    this.userState.answers = this.userState.answers.filter(a => a.themeId !== themeId);
    this.updateState();
  }

  getSelectedThemes(): string[] {
    return this.userState.selectedThemes;
  }

  addAnswer(answer: UserAnswer): void {
    this.userState.answers = this.userState.answers.filter(a => a.questionId !== answer.questionId);
    this.userState.answers.push(answer);
    this.updateState();
  }

  getAnswers(): UserAnswer[] {
    return this.userState.answers;
  }

  getAnswerForQuestion(questionId: string): UserAnswer | undefined {
    return this.userState.answers.find(a => a.questionId === questionId);
  }

  completeProcess(): void {
    this.userState.completed = true;
    this.updateState();
  }

  getElapsedTime(): number {
    if (this.userState.startTime === 0) return 0;
    return Math.floor((Date.now() - this.userState.startTime) / 1000);
  }

  isCompleted(): boolean {
    return this.userState.completed;
  }

  getCurrentState(): UserState {
    return this.userState;
  }

  private updateState(): void {
    this.userStateSubject.next({ ...this.userState });
  }
}
