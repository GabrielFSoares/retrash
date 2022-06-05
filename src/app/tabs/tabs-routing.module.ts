import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: 'perfil',
        loadChildren: () => import('../perfil/perfil.module').then(m => m.PerfilPageModule)
      },
      {
        path: 'trocar-pontos',
        loadChildren: () => import('../trocar-pontos/trocar-pontos.module').then( m => m.TrocarPontosPageModule)
      },
      {
        path: 'historico',
        loadChildren: () => import('../historico/historico.module').then( m => m.HistoricoPageModule)
      },
      {
        path: 'solicitar-coleta',
        loadChildren: () => import('../solicitar-coleta/solicitar-coleta.module').then( m => m.SolicitarColetaPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/tab2',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
