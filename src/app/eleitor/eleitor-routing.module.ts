import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './../auth/auth-guard';
import { EleitorDetalheComponent } from './eleitor-detalhe/eleitor-detalhe.component';
import { EleitorImpressaoComponent } from './eleitor-impressao/eleitor-impressao.component';
import { EleitorComponent } from './eleitor.component';

const routes: Routes = [
  { path: 'eleitores', component: EleitorComponent, canActivate: [AuthGuard] },
  { path: 'eleitor/:id', component: EleitorDetalheComponent, canActivate: [AuthGuard] },
  { path: 'eleitor', component: EleitorDetalheComponent, canActivate: [AuthGuard] },
  { path: 'impressao/:id', component: EleitorImpressaoComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EleitorRoutingModule { }
