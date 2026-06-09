import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Theme } from '../../models/models';
import { DataService } from '../../services/data.service';
import { UserStateService } from '../../services/user-state.service';

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.scss']
})
export class ThemesComponent implements OnInit {

  themes: Theme[] = [];
  selectedThemes: Set<string> = new Set();
  minThemesRequired = 2;

  constructor(
    private dataService: DataService,
    private userStateService: UserStateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.themes = this.dataService.getThemes();
    this.userStateService.userState$.subscribe(state => {
      this.selectedThemes = new Set(state.selectedThemes);
    });
  }

  /**
   * Bascule la sélection d'un thème
   */
  toggleTheme(themeId: string): void {
    if (this.selectedThemes.has(themeId)) {
      this.userStateService.deselectTheme(themeId);
    } else {
      this.userStateService.selectTheme(themeId);
    }
  }

  /**
   * Vérifie si un thème est sélectionné
   */
  isThemeSelected(themeId: string): boolean {
    return this.selectedThemes.has(themeId);
  }

  /**
   * Récupère l'heure estimée pour les thèmes sélectionnés
   */
  getEstimatedTime(): number {
    let totalTime = 0;
    this.selectedThemes.forEach(themeId => {
      const theme = this.themes.find(t => t.id === themeId);
      if (theme) {
        totalTime += theme.estimatedTime;
      }
    });
    return totalTime;
  }

  /**
   * Convertit les secondes en minutes
   */
  secondsToMinutes(seconds: number): number {
    return Math.ceil(seconds / 60);
  }

  /**
   * Passe à l'étape des questions
   */
  continueToQuestions(): void {
    if (this.selectedThemes.size >= this.minThemesRequired) {
      this.router.navigate(['/questions']);
    }
  }

  /**
   * Revient à la page d'accueil
   */
  goBack(): void {
    this.router.navigate(['/home']);
  }
}
