import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreCollectionGroup   } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { TabsPage } from '../tabs/tabs.page';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public pontos: number;
  public quantGarrafa: number;
  public quantLatinha: number;
  public quantPapel: number;
  public quantOleo: number;

  private estatisticaUsuario: AngularFirestoreCollectionGroup;
  private allInfo: Observable<any>;
  constructor(
    public router: Router,
    private readonly afs: AngularFirestore,
    public tabInfo: TabsPage
  ) {
    this.estatisticaUsuario = this.afs.collectionGroup('estatisticas', ref => ref.where('id', '==', localStorage.token));
    this.allInfo = this.estatisticaUsuario.valueChanges();
    this.recuperarInfoUser();
  }

  recuperarInfoUser(){
    this.allInfo.subscribe(info => {
      console.log(info);
      this.pontos = info[0].pontos;
      this.quantGarrafa = info[0].garrafas;
      this.quantLatinha = info[0].latinhas;
      this.quantPapel = info[0].papel;
      this.quantOleo = info[0].oleo;
    });
  }

  navegar(){
    this.tabInfo.selectMenu('nenhuma');
  }

  selectInformation(value: string) {
    this.router.navigate(['/informations', value]);
  }
}
