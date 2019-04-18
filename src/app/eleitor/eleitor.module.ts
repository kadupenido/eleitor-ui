import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EleitorRoutingModule } from './eleitor-routing.module';
import { EleitorComponent } from './eleitor.component';

@NgModule({
  declarations: [EleitorComponent],
  imports: [
    CommonModule,
    EleitorRoutingModule
  ]
})
export class EleitorModule { }
