import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { InformationsComponent } from './tab2/informations/informations/informations.component';
import { OptionsComponent } from './tab3/options/options.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'cadastro',
    loadChildren: () => import('./cadastro/cadastro.module').then( m => m.CadastroPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'options/:id',
    component: OptionsComponent
  },
  {
    path: 'informations/:id',
    component: InformationsComponent
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
