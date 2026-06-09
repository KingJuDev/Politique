import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemesComponent } from './themes.component';

@NgModule({
  declarations: [ThemesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: ThemesComponent }
    ])
  ]
})
export class ThemesModule { }
