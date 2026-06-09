import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'themes',
    loadChildren: () => import('./components/themes/themes.module').then(m => m.ThemesModule)
  },
  {
    path: 'questions',
    loadChildren: () => import('./components/questions/questions.module').then(m => m.QuestionsModule)
  },
  {
    path: 'results',
    loadChildren: () => import('./components/results/results.module').then(m => m.ResultsModule)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
