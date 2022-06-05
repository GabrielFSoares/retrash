import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacaoService } from 'src/app/usuario/autenticacao.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AppComponent } from '../app.component';

interface CadastroUsuario {
  id: string;
}

interface CadastroUsuarioId {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  celular: string;
  endereco: {};
}

interface Estatisticas {
  garrafas: number;
  oleo: number;
  latinhas: number;
  papel: number;
  pontos: number;
  id: string;
}
@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {

  public nome: string;
  public celular: string;
  public endereco: string;
  public cpf: string;
  public email: string;
  public senha: string;
  public mensagem: string;

  public formFields: any;
  public formData: any = {};
  public formDataValidate: any = {};
  public form;
  public formNoMask;


  public verificadorCPF: boolean;
  public verificadorSenha: boolean;
  public verificadorSenhaConfirmar: boolean;
  public verificadorEmail: boolean;
  public verificadorTel: boolean;


  private usuarioId: AngularFirestoreCollection<CadastroUsuarioId>;
  private itensUsuario: Observable<CadastroUsuarioId[]>;

  private valoresUsuario: Observable<CadastroUsuarioId[]>;
  private usuarioIdEstatisticas: AngularFirestoreCollection<Estatisticas>;
  private itemsCollection: AngularFirestoreCollection<CadastroUsuario>;

  private items: Observable<CadastroUsuario[]>;
 
  constructor(
    public router: Router,
    public autenticacaoService: AutenticacaoService,
    private readonly afs: AngularFirestore,
    public appComponent: AppComponent
  ) { }

  ngOnInit() {
  }

  cadastrar() {
    console.log(this.verificadorCPF);
    if(
        !(this.verificadorCPF &&
        this.verificadorEmail &&
        this.verificadorSenha &&
        this.verificadorTel &&
        this.verificadorSenhaConfirmar &&
        this.nome)
      ){
      this.appComponent.exibeMensagem('Preencha os dados de forma válida.');
      return;
    }
    this.autenticacaoService.insereNoFireBase(this.email, this.senha)
      .then(res => {
        localStorage.setItem('token', res.user.uid);
        localStorage.setItem('email', res.user.email);
        localStorage.setItem('nome', this.nome);
        this.itemsCollection = this.afs.collection<CadastroUsuario>(`usuarios`);
        this.items = this.itemsCollection.valueChanges({ idField: 'customID' });
        const id = res.user.uid;
        this.itemsCollection.doc(id);

        this.usuarioId = this.afs.collection<CadastroUsuarioId>(`usuarios/${id}/informacoes`);
        this.itensUsuario = this.usuarioId.valueChanges({ idField: 'customID' });

        const item: CadastroUsuarioId = {
          id,
          nome: this.nome,
          email: this.email,
          cpf: this.cpf,
          celular: this.celular,
          endereco: ''
        };
        this.usuarioId.doc(id).set(item);

        const { usuarioIdEstatisticas, itemEstatisticas } = this.cadastrarEstatistica(id);
        this.usuarioIdEstatisticas.doc(id).set(itemEstatisticas)
          .then(test => {
            this.appComponent.exibeMensagem('Cadastro realizado com sucesso!');
            this.email = '';
            this.senha = '';
            this.router.navigateByUrl('/tabs');
          }).catch(err => {
            console.log(err);
          });
      }).catch(err => {
        this.appComponent.exibeMensagem('Erro ao cadastrar o usuário. Tente novamente mais tarde.');
      });
  }

  cadastrarEstatistica(id) {
    this.usuarioIdEstatisticas = this.afs.collection<Estatisticas>(`usuarios/${id}/estatisticas`);
    const itemEstatisticas: Estatisticas = {
      papel: 0,
      latinhas: 0,
      oleo: 0,
      garrafas: 0,
      pontos: 0,
      id
    };

    return { usuarioIdEstatisticas: this.usuarioIdEstatisticas, itemEstatisticas };
  }
  voltar() {
    this.router.navigateByUrl('/login');
  }
  chamar() {
    console.log(this.email);
  }
  //validando CPF
  validarCPF(cpf: string) {
    if(cpf === '' || cpf === undefined){
      return;
    }
    let soma;
    let resto;
    soma = 0;
    if (cpf.length !== 11 ||
      cpf === '00000000000' ||
      cpf === '11111111111' ||
      cpf === '22222222222' ||
      cpf === '33333333333' ||
      cpf === '44444444444' ||
      cpf === '55555555555' ||
      cpf === '66666666666' ||
      cpf === '77777777777' ||
      cpf === '88888888888' ||
      cpf === '99999999999'){
        return false;
    }

    for (let i = 1; i <= 9; i++){
      soma = soma + parseInt(cpf.substring(i - 1, i), 10) * (11 - i);
      resto = (soma * 10) % 11;
    }

    if ((resto === 10) || (resto === 11)){
      resto = 0;
    }
    if (resto !== parseInt(cpf.substring(9, 10), 10)){
      return false;
    }

    soma = 0;
    for (let i = 1; i <= 10; i++){
      soma = soma + parseInt(cpf.substring(i - 1, i), 10) * (12 - i);
      resto = (soma * 10) % 11;
    }

    if ((resto === 10) || (resto === 11)){
      resto = 0;
    }
    if (resto !== parseInt(cpf.substring(10, 11), 10)){
      return false;
    }
    return true;
  }


  isEmail(email){
    if(email === '' || email === undefined){
      return;
    }
    const emailPattern =  /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
     if(emailPattern.test(email)){
      return true;
    };
    return false;
  }

  isPhone(cel){
    if(cel === '' || cel === undefined){
      return;
    }

    const regexPhone = /^\(?(?:[14689][1-9]|2[12478]|3[1234578]|5[1345]|7[134579])\)? ?(?:[2-8]|9[1-9])[0-9]{3}\-?[0-9]{4}$/;
    if(regexPhone.test(cel)){
      return true;
    };
    return false;
  }

  isPassword(senha){
    if(senha === '' || senha === undefined){
      return;
    }

    if(senha.length < 6){
      return false;
    }
    return true;
  }

  isConfirmarSenha(senha, confirmarSenha){
    if(confirmarSenha === '' || confirmarSenha === undefined){
      return;
    }

    if(!(confirmarSenha === senha)){
      return false;
    }

    return true;

  }
  ionViewDidEnter() {
    this.appComponent.verificarToken();
  }
}
