import { Injectable } from '@angular/core';
import { ScoreResult, UserAnswer, AnswerDetail, SKIP_OPTION_ID } from '../models/models';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  constructor(private dataService: DataService) { }

  /**
   * Calcule les scores de compatibilité pour tous les candidats
   */
  calculateScores(answers: UserAnswer[]): ScoreResult[] {
    const candidates = this.dataService.getCandidates();
    const results: ScoreResult[] = [];

    candidates.forEach(candidate => {
      let totalScore = 0;
      let totalPossible = 0;

      answers.forEach(answer => {
        if (answer.optionId === SKIP_OPTION_ID) return;
        const question = this.dataService.getQuestion(answer.questionId);
        if (question) {
          const option = question.options.find(o => o.id === answer.optionId);
          if (option && option.positions[candidate.id] !== undefined) {
            // Le score de chaque question est basé sur la position du candidat sur la réponse
            // On ajoute 5 pour normaliser entre 0 et 10 (positions vont de -5 à 5)
            const candidatePosition = option.positions[candidate.id];
            const score = Math.max(0, Math.min(10, 5 + candidatePosition));
            totalScore += score;
            totalPossible += 10;
          }
        }
      });

      const percentage = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0;

      results.push({
        candidateId: candidate.id,
        candidateName: candidate.name,
        party: candidate.party,
        color: candidate.color,
        score: Math.round(totalScore),
        percentage: Math.round(percentage)
      });
    });

    // Trier par percentage décroissant
    return results.sort((a, b) => b.percentage - a.percentage);
  }

  getCandidateAnswerDetails(candidateId: string, answers: UserAnswer[]): AnswerDetail[] {
    const details: AnswerDetail[] = [];

    answers.forEach(answer => {
      if (answer.optionId === SKIP_OPTION_ID) return;
      const question = this.dataService.getQuestion(answer.questionId);
      if (!question) return;
      const option = question.options.find(o => o.id === answer.optionId);
      if (!option || option.positions[candidateId] === undefined) return;

      details.push({
        questionText: question.text,
        userOptionText: option.text,
        position: option.positions[candidateId],
        themeId: question.themeId
      });
    });

    return details.sort((a, b) => b.position - a.position);
  }

  getMaximumScore(numberOfAnswers: number): number {
    return numberOfAnswers * 10;
  }
}
