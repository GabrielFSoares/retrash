import { Component, OnInit } from '@angular/core';
import { faArrowLeft, faCopy } from '@fortawesome/free-solid-svg-icons';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { Tab2Page } from '../tab2/tab2.page';
import { TabsPage } from '../tabs/tabs.page';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { AppComponent } from '../app.component';
interface PedidosTrocarPontos {
  pontos: number;
  descrição: string;
  empresa: string;
  cupom: string;
  imagemDoProduto: string;
  logoEmpresa: string;
  data: any;
}

interface InfoPontos {
  pontos: number;
}
@Component({
  selector: 'app-trocar-pontos',
  templateUrl: './trocar-pontos.page.html',
  styleUrls: ['./trocar-pontos.page.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class TrocarPontosPage implements OnInit {

  public code: string;
  public produtos: string[] = [];
  public produto: string;
  public verificarStatusPontos: boolean;
  faArrowLeft = faArrowLeft;
  public faCopy = faCopy;
  
  private allInfo: Observable<any>;
  private pontos: InfoPontos;
  private infoEmpresa:  AngularFirestoreCollection<InfoPontos>;
  private editPontos: AngularFirestoreCollection<any>;
  private trocaDePontos: AngularFirestoreCollection<PedidosTrocarPontos>;

  constructor(
    private afs: AngularFirestore,
    private modalService: NgbModal,
    public tabInfoPontos: Tab2Page,
    public tabInfo: TabsPage,
    private appComponent: AppComponent,
    private clipboard: Clipboard,
    public router: Router) { }

  ngOnInit() {
    this.recuperarProdutos();
  }

  recuperarProdutos(){
    this.allInfo = this.afs.collectionGroup('produtos', ref => ref.orderBy('pontos', 'desc')).valueChanges({ idField: 'docId' });
    this.allInfo.subscribe( info => {
      this.verificarStatusPontos = true;
      console.log(info);
      this.produtos = [];
      this.produtos.push(...info);
      setTimeout(() => {
        this.verificarStatusPontos = false;
      }, 2000);
  });
}


  trocarPontos(produto){
    if(this.tabInfoPontos.pontos < produto.pontos){
      return;
    }
    this.trocaDePontos = this.afs.collection<PedidosTrocarPontos>(`usuarios/${localStorage.token}/trocar pontos`);
    //CUPOM DO USUÁRIO
    this.code = this.geraStringAleatoria(10);
    const item: PedidosTrocarPontos = {
      pontos: produto.pontos,
      descrição: produto.descricao,
      imagemDoProduto: produto.imagem,
      empresa: produto.nomeEmpresa,
      cupom: this.code,
      logoEmpresa: produto.logoEmpresa,
      data: firebase.firestore.FieldValue.serverTimestamp()
    };
    this.editPontos = this.afs.collection<any>(`usuarios/${localStorage.token}/estatisticas`);
    this.editPontos.doc(localStorage.token).update({
      pontos: firebase.firestore.FieldValue.increment(-item.pontos),
    });
    this.trocaDePontos.doc().set(item);

    console.log(this.code)
  }

  geraStringAleatoria(tamanho) {
    let stringAleatoria = '';
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < tamanho; i++) {
        stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return stringAleatoria;
  }

  navegar(url: string){
      this.tabInfo.selectMenu(`/${url}`);
  }

  open(content, produto?) {
    this.modalService.open(content, { centered: true, size: 'sm' });
    if(produto) {
      this.produto = produto;
    }
  }

  setProduto() {
    this.trocarPontos(this.produto);
  }

  copyCode(cupom: string){
    this.clipboard.clear();
    console.log(cupom);
    this.clipboard.copy(cupom);

    this.clipboard.paste().then(
      (resolve: string) => {
          this.appComponent.exibeMensagem(`O seu cupom ${resolve} foi copiado.`);
        },
        (reject: string) => {
          this.appComponent.exibeMensagem("Não foi possível copiar o seu cupom");
        }
      );
  }

}
