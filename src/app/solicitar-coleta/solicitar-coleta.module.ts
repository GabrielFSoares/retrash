import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolicitarColetaPageRoutingModule } from './solicitar-coleta-routing.module';

import { SolicitarColetaPage } from './solicitar-coleta.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    SolicitarColetaPageRoutingModule
  ],
  declarations: [SolicitarColetaPage]
})
export class SolicitarColetaPageModule {}
