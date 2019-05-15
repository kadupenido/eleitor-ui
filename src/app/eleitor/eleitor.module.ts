import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { EleitorDetalheComponent } from './eleitor-detalhe/eleitor-detalhe.component';
import { EleitorImpressaoComponent } from './eleitor-impressao/eleitor-impressao.component';
import { EleitorRoutingModule } from './eleitor-routing.module';
import { EleitorComponent } from './eleitor.component';

@NgModule({
  declarations: [
    EleitorComponent,
    EleitorDetalheComponent,
    EleitorImpressaoComponent
  ],
  imports: [
    CommonModule,
    EleitorRoutingModule,
    NgbPaginationModule,
    ReactiveFormsModule
  ]
})
export class EleitorModule { }
