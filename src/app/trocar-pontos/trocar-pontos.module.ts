import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrocarPontosPageRoutingModule } from './trocar-pontos-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TrocarPontosPage } from './trocar-pontos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrocarPontosPageRoutingModule, 
    FontAwesomeModule
  ],
  declarations: [TrocarPontosPage]
})
export class TrocarPontosPageModule {}
