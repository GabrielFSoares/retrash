import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrocarPontosPage } from './trocar-pontos.page';

const routes: Routes = [
  {
    path: '',
    component: TrocarPontosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrocarPontosPageRoutingModule {}
