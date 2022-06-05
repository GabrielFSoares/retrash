import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection  } from '@angular/fire/compat/firestore';
import * as moment from 'moment';
import { TabsPage } from '../tabs/tabs.page';

type HistoricoUsuario = {
  nome: string;

};
@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
})
export class HistoricoPage implements OnInit {
  public arrayObj = [];
  public verificarHisty: boolean;
  public ofItem = false;
  private usuarioId: AngularFirestoreCollection<HistoricoUsuario>;
  private allInfo: Observable<any>;
  constructor(public router: Router, private readonly afs: AngularFirestore , public tabInfo: TabsPage) {
   this.valor();
   }

  ngOnInit() {
  }

  valor(){
    this.allInfo = this.afs.collection(`usuarios/${localStorage.token}/historico`, ref => ref.orderBy('data', 'desc'))
      .valueChanges({ idField: 'docId' });

    this.allInfo.subscribe(info => {
      this.verificarHisty = true;
      this.ofItem = false;
      this.arrayObj = [];
      console.log(info);

      if(info.length === 0){
        this.ofItem = true;
        return;
      }
      this.arrayObj.push(...info);
      setTimeout(() => {
        this.verificarHisty = false;
      }, 3000)
    });
  }

  converterDatar(data, tipo){
    moment.locale('pt-br');
    const dataFormatada = moment(data*1000).format(tipo);

    return dataFormatada;
  }

  navegar(url: string , rotaPrincipal?){
    if(rotaPrincipal){
      this.tabInfo.selectMenu(`/${url}`);
    }
    this.router.navigateByUrl(`/${url}`);
  }



}
