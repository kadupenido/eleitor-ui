import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './../auth/auth-guard';
import { EleitorComponent } from './eleitor.component';

const routes: Routes = [
  { path: 'eleitores', component: EleitorComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EleitorRoutingModule { }
