import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacaoService } from 'src/app/usuario/autenticacao.service';
import { AppComponent } from '../app.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public email: string;
  public senha: string;
  constructor(
    public router: Router,
    public autenticacaoService: AutenticacaoService,
    public appComponent: AppComponent
  ) { }

  ngOnInit() {
  }
  loginUsuario(){
    this.autenticacaoService.loginNoFireBase(this.email, this.senha)
    .then( res => {
      console.log(res);
      localStorage.setItem('token', res.user.uid);
      localStorage.setItem('email', res.user.email);
      this.email = '';
      this.senha = '';
      this.router.navigateByUrl('/tabs');
    }).catch( err => {
      this.appComponent.exibeMensagem('A senha é inválida ou o usuário não possui uma senha.');
    });
  }

  ionViewDidEnter() {
    this.appComponent.verificarToken();
  }

}
