import { Component, OnInit } from '@angular/core';
import { faHandshake, faHome, faBars } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subject, of } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollectionGroup } from '@angular/fire/compat/firestore';
import { maskBr } from 'js-brasil';

interface Informacoes {

  name: string;
  firtsName: string;
  cpf: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
}
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  faHandshake = faHandshake;
  faHome = faHome;
  faBars = faBars;

  public name: string;
  public firtsName: string;
  public cpf: string;
  public email: string;
  public phone: string;
  public address: string;
  public avatar: string;

  public informacoesDoUsuario = {
    name: '',
    firtsName: '',
    cpf: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
  }
  public info: any;
  public rotas: string;
  // public informacoesUsuarioTab: Observable<any>;
  public informacaoUsuarioTest: Observable<Informacoes>;
  private inforUsuario: AngularFirestoreCollectionGroup;
  private allInfo: Observable<any>;

  constructor(private readonly afs: AngularFirestore) {
  }

  recuperarInfoUser() {
    this.allInfo.subscribe(info => {
      console.log(info);
      console.log("novamente 232");
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      info[0].avatar ?
        this.informacoesDoUsuario.avatar = info[0].avatar :
        this.informacoesDoUsuario.avatar = 'assets/perfil.png';

      this.informacoesDoUsuario.phone = maskBr.celular(info[0].celular);
      this.informacoesDoUsuario.address = `${info[0].endereco.logadouro}...`;
      this.informacoesDoUsuario.cpf = maskBr.cpf(info[0].cpf);
      this.informacoesDoUsuario.email = info[0].email;
      this.informacoesDoUsuario.name = info[0].nome;
      this.informacoesDoUsuario.firtsName = info[0].nome.split(' ')[0];
      this.info = info;
    });
  }

  informacoesUsuarioTab() {
    return new Observable(subscriber => {
      let informaçõesAnteriores;
      let verificador = true;
      setInterval(() => {
        if (verificador) {
          verificador = false;
          informaçõesAnteriores = this.info;
          subscriber.next(this.info);
        }
        if (informaçõesAnteriores !== this.info) {
          informaçõesAnteriores = this.info;
          subscriber.next(this.info);
        }
      }, 1000);
    });
  }
  ngOnInit() {
    const url = window.location.pathname;
    this.selectMenu(url);
    this.inforUsuario = this.afs.collectionGroup('informacoes', ref => ref.where('id', '==', localStorage.token));
    this.allInfo = this.inforUsuario.valueChanges();
    this.recuperarInfoUser();
  }


  selectMenu(name: string) {
    this.rotas = name;
    if (name === '/tabs/tab3') {
      document.getElementById('home').className = 'text-secondary';
      document.getElementById('parceiros').className = 'text-secondary';
      document.getElementById('menut').className = 'colorGreen';
    } else if (name === '/tabs/tab2') {
      document.getElementById('menut').className = 'text-secondary';
      document.getElementById('home').className = 'colorGreen';
      document.getElementById('parceiros').className = 'text-secondary';
    } else if (name === '/tabs/tab1') {
      document.getElementById('menut').className = 'text-secondary';
      document.getElementById('home').className = 'text-secondary';
      document.getElementById('parceiros').className = 'colorGreen ';
    } else {
      document.getElementById('menut').className = 'text-secondary';
      document.getElementById('home').className = 'text-secondary';
      document.getElementById('parceiros').className = 'text-secondary ';
    }
  }
}
