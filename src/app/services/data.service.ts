import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { Candidate, Theme, Question, QuizLength } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private candidates: Candidate[] = [];
  private themes: Theme[] = [];
  private questions: Question[] = [];

  constructor(private http: HttpClient) {}

  load(): Observable<void> {
    return forkJoin([
      this.http.get<Candidate[]>('assets/data/candidates.json'),
      this.http.get<Theme[]>('assets/data/themes.json'),
      this.http.get<Question[]>('assets/data/questions.json')
    ]).pipe(
      map(([candidates, themes, questions]) => {
        this.candidates = candidates;
        this.themes = themes;
        this.questions = questions;
      })
    );
  }

  getCandidates(): Candidate[] {
    return this.candidates;
  }

  getCandidate(id: string): Candidate | undefined {
    return this.candidates.find(c => c.id === id);
  }

  getThemes(): Theme[] {
    return this.themes;
  }

  getTheme(id: string): Theme | undefined {
    return this.themes.find(t => t.id === id);
  }

  getQuestions(): Question[] {
    return this.questions;
  }

  getQuestionsByTheme(themeId: string): Question[] {
    return this.questions.filter(q => q.themeId === themeId);
  }

  getQuestion(id: string): Question | undefined {
    return this.questions.find(q => q.id === id);
  }

  getQuestionsForQuiz(length: QuizLength, themeIds: string[]): Question[] {
    const maxImportance = length === 'short' ? 1 : length === 'medium' ? 2 : 3;
    return this.questions.filter(q =>
      themeIds.includes(q.themeId) && q.importance <= maxImportance
    );
  }
}
