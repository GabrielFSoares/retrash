import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreCollectionGroup } from '@angular/fire/compat/firestore';
import { maskBr } from 'js-brasil';
import { validateBr } from 'js-brasil';
import { Platform, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AutenticacaoService } from '../usuario/autenticacao.service';
import { getAuth, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { TabsPage } from '../tabs/tabs.page';

interface Informacoes {
  celular: string;
  cpf: string;
  email: string;
  endereco: any;
}

interface ApiEndereco {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;

}

interface infoEdit {
  nome: string
  email: string
  celular: string
  endereco: any;
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  providers: [NgbModalConfig, NgbModal]
})

export class Tab3Page {

  public name: string;
  public firtsName: string;
  public cpf: string;
  public email: string;
  public phone: string;
  public address: string;

  public visible1: boolean = true;
  public visible2: boolean = true;
  public visible3: boolean = true;

  public cep: number;
  public endereco: string;
  public bairro: string;
  public numero: number;
  public complemento:  '';
  public localidade: string;
  public uf: string;
  public info: any;

  private newPassword: string;
  private password: string;
  private confirmPassword: string;

  private infoUser: Observable<Informacoes[]>;
  private inforUsuario: AngularFirestoreCollectionGroup;
  private allInfo: Observable<any>;
  private usuarioId: AngularFirestoreCollection<infoEdit>;

  constructor(
    public router: Router,
    private readonly afs: AngularFirestore,
    private platform: Platform,
    public toastController: ToastController,
    public http: HttpClient,
    config: NgbModalConfig,
    public tabInfo: TabsPage,
    private modalService: NgbModal,
    public autenticacaoService: AutenticacaoService,    
    ) {
    this.inforUsuario = this.afs.collectionGroup('informacoes', ref => ref.where('id', '==', localStorage.token));
    this.allInfo = this.inforUsuario.valueChanges();
    this.recuperarInfoUser();
    config.backdrop = 'static';
    config.keyboard = false;
  }

  selectOption(value: string) {
    this.router.navigate(['/options', value]);
  }

  sair(){
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  }

  recuperarInfoUser(){
    this.tabInfo.informacoesUsuarioTab().subscribe(info => {
        this.phone = maskBr.celular(info[0].celular);
        this.address = `${info[0].endereco.logadouro}...`;
        this.cpf = maskBr.cpf(info[0].cpf);
        this.email = info[0].email;
        this.name = info[0].nome;
        this.firtsName = info[0].nome.split(' ')[0];
        this.cep = info[0].endereco.cep;
        this.complemento = info[0].endereco.complemento;
        this.localidade = info[0].endereco.localidade;
        this.endereco = info[0].endereco.logadouro;
        this.uf = info[0].endereco.uf;
        this.numero = info[0].endereco.numero;
        this.bairro = info[0].endereco.bairro;

        if(this.address === 'undefined...') {
          this.address = 'Sem cadastro';
        }

        this.info = info;
      });
  }

  ionViewDidEnter(){
  }

  edit(id:string) {
    let name = document.getElementById("name")
    let email = document.getElementById("email")
    let phone = document.getElementById("phone")

    if(id == "name") {
      this.visible1 = false
      name.removeAttribute('readonly')
    } else if (id == "email") {
      this.visible2 = false
      email.removeAttribute('readonly')
    } else if(id == "phone") {
      this.visible3 = false
      phone.removeAttribute('readonly')
    }
  }

  update(i:string) {
    let name = document.getElementById("name")
    let email = document.getElementById("email")
    let phone = document.getElementById("phone") 
    const auth = getAuth();
    const user = auth.currentUser;

    const id = localStorage.token
    this.usuarioId = this.afs.collection<infoEdit>(`usuarios/${id}/informacoes`)

    if(i == "name") {
      this.visible1 = true
      this.usuarioId.doc(id).update({nome: this.name})
      name.setAttribute('readonly', 'true')
      this.displayModal('Alteração realizada com sucesso!')
    } else if (i == "email") {
      this.visible2 = true
      updateEmail(auth.currentUser, this.email).then(() => {
        this.usuarioId.doc(id).update({email: this.email})
        email.setAttribute('readonly', 'true')
        this.displayModal('Alteração realizada com sucesso!')
      }).catch((error) => {
        console.log(error)
        this.displayModal('Erro ao alterar email.')
        this.recuperarInfoUser()
      });
      
    } else if(i == "phone") {
      this.visible3 = true
      this.usuarioId.doc(id).update({celular: this.phone})
      phone.setAttribute('readonly', 'true')
      this.displayModal('Alteração realizada com sucesso!')

    } else if(i == "address") {
      let address = {
        cep: this.cep,
        logadouro: this.endereco,
        complemento: this.complemento ? this.complemento : ' ',
        bairro: this.bairro,
        localidade: this.localidade,
        numero: this.numero,
        uf: this.uf
      }

      this.usuarioId.doc(id).update({endereco: address})
      this.displayModal('Alteração realizada com sucesso!')
      
    } else if(i == "password") {

      const credential = EmailAuthProvider.credential(user.email, this.password)

      reauthenticateWithCredential(user, credential).then(() => {
        console.log('Usuário reautenticado')
      }).catch((error) => {
        this.displayModal('Senha incorreta! Tente novamente')
        throw 'Senha incorreta'
      })

      if(this.newPassword === this.confirmPassword) {
        updatePassword(user, this.newPassword)
        this.displayModal('Alteração realizada com sucesso!')
      } else {
        this.displayModal('Senhas não coincidem')
      }

      this.password = ""
      this.newPassword = ""
      this.confirmPassword = ""
    }
  }

  async displayModal(message:string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    })
    toast.present();
  }


  recuperarEndereco(value){
    console.log(value);
    console.log(value.toString().length);
    if(value.toString().length === 8){
      const API_ENDERECO = `https://viacep.com.br/ws/${value}/json/`;

      const response = this.http.get(API_ENDERECO);
      response.subscribe(data =>{
          console.log(data);
          this.endereco = data['logradouro'];
          this.bairro = data['bairro'];
          this.localidade = data['localidade'];
          this.uf = data['uf'];
      },
      error =>{
        console.log(error);
      });
    }
  }

  open(content) {
    this.modalService.open(content, { centered: true });
  }

}
