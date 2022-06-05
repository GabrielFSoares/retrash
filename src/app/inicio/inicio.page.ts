import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  constructor(
    public router: Router,
    public appComponent: AppComponent
  ) { }

  ngOnInit() {
  }

  btnLogin(){
    this.router.navigateByUrl('/login');
  }

  btnCadastrar(){
    this.router.navigateByUrl('/cadastro');
  }


  ionViewDidEnter() {
    this.appComponent.verificarToken();
  }
}
