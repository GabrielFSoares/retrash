import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitarColetaPage } from './solicitar-coleta.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitarColetaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitarColetaPageRoutingModule {}
