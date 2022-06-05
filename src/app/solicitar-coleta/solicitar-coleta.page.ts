/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import firebase from 'firebase/compat/app';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection  } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { TabsPage } from '../tabs/tabs.page';
export interface Item { name: string;}

type InformationUser = {
  cpf: number;
  nome: string;
  endereco: string;
}
export interface HistoricoUsuario {
  nome: string;
  id: string;
  pontos: number;
  status: string;
  endereco: string;
  data?: any;
  cpf: number;
}
@Component({
  selector: 'app-solicitar-coleta',
  templateUrl: './solicitar-coleta.page.html',
  styleUrls: ['./solicitar-coleta.page.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class SolicitarColetaPage {
  public objeto = {
    oleo: 0,
    garrafa: 0,
    latinha: 0,
    papel: 0
  };

  public valorItens = {
    garrafa: 0.80,
    oleo: 1,
    latinha: 4.50
  };

  form: FormGroup;

  public valorTotalPontos = 0;
  public item;
  public lat: number;
  public long: number;
  private usuarioId: AngularFirestoreCollection<HistoricoUsuario>;
  private items: Observable<HistoricoUsuario[]>;
  private informacoesUser:  AngularFirestoreCollection<InformationUser>;
  private allInfoUser:  Observable<InformationUser[]>;

  constructor(
    public router: Router,
    public appComponent: AppComponent,
    private afs: AngularFirestore,
    public http: HttpClient,
    config: NgbModalConfig,
    public tabInfo: TabsPage,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.form = this.fb.group({
      data: [null, [Validators.required]],
      horario1: [null, [Validators.required]],
      horario2: [null, [Validators.required]]
    });
  }

  subtrair(item){
    if( this.objeto[item] !== 0){
      this.objeto[item] -= 1;
    }
  }

  somar(item){
    this.objeto[item] += 1;
  }

  navegar(url: string , rotaPrincipal?){
    if(rotaPrincipal){
      this.tabInfo.selectMenu(`/${url}`);
    }
    this.router.navigateByUrl(`/${url}`);
  }

  open(content) {
    if(this.valorTotalPontos >= 100){
      this.modalService.open(content, { centered: true });
    } else{
      this.appComponent.exibeMensagem(`São necessário mais ${100 - this.valorTotalPontos} pontos para solicitar a coleta`);
    }
  }

  confirmarSolicitacao(){
   const key = 'AIzaSyCl919Z5Z2Vi0GrCeM5b6opfIra664wrdI';
   const lixoColetado = {};
   //verificando qual os itens que o usuário solicitou a coleta
   Object.keys(this.objeto).map((items) => {
    this.objeto[items] > 0 ? lixoColetado[items] = this.objeto[items] : '';
   });


  this.usuarioId = this.afs.collection<HistoricoUsuario>(`usuarios/${localStorage.token}/historico`);
  this.informacoesUser = this.afs.collection<InformationUser>(`usuarios/${localStorage.token}/informacoes`);

    this.informacoesUser.doc(localStorage.token).get().toPromise().then((doc) => {
      const objetoInfo = doc.data();
      if(Object.values(objetoInfo.endereco).length === 0){
        this.appComponent.exibeMensagem('Você precisa cadastrar um endereço primeiro');
        this.navegar('/tabs/tab3');
        return;
      }
      const enderecoCompleto = `${objetoInfo.endereco['numero']} ${objetoInfo.endereco['logadouro']} ${objetoInfo.endereco['complemento']}
      ${objetoInfo.endereco['bairro']} ${objetoInfo.endereco['localidade']}`;
      const API_ENDERECO = `https://maps.googleapis.com/maps/api/geocode/json?address=${enderecoCompleto}&key=${key}`;
      const response = this.http.get(API_ENDERECO);

      response.subscribe(values =>{
        console.log(values)
        // eslint-disable-next-line @typescript-eslint/dot-notation
        this.lat = values['results'][0].geometry.location.lat;
        // eslint-disable-next-line @typescript-eslint/dot-notation
        this.long = values['results'][0].geometry.location.lng;
    },
    error =>{
      console.log(error);
    });
    setTimeout(() => {
      console.log(this.form);
      console.log(this.lat);
      console.log(this.long);
      moment.locale('pt-br');
        this.item = {
          id: localStorage.token,
          nome: objetoInfo.nome,
          cpf: objetoInfo.cpf,
          pontos: this.valorTotalPontos,
          long: this.long,
          coleta: {
            data: moment(this.form.value.data).format('L'),
            horario1: this.form.value.horario1,
            horario2: this.form.value.horario2,
          },
          lat: this.lat,
          status: 'Pendente',
          endereco: objetoInfo.endereco, ...lixoColetado
        };
        this.usuarioId.add({data: firebase.firestore.FieldValue.serverTimestamp(), ...this.item});
        this.zerarValor();
        this.appComponent.exibeMensagem('Solicitação enviada com sucesso!');
    }, 3000);
    });
  }

  calcularPontos(){
    const valorTotal = (
      (this.valorItens.latinha * this.objeto.latinha / 67) +
      (this.valorItens.garrafa * this.objeto.garrafa / 22) +
      (this.valorItens.oleo * this.objeto.oleo / 1)
    );
    const pontos = 100 * (valorTotal * 0.4) / 1;
    this.valorTotalPontos = Math.floor(pontos);
    console.log(this.valorTotalPontos);
  }

  zerarValor(){
    this.objeto.oleo = 0;
    this.objeto.garrafa = 0;
    this.objeto.papel = 0;
    this.objeto.latinha = 0;
  }

  ionViewDidEnter(){
    this.zerarValor();
  }
}
