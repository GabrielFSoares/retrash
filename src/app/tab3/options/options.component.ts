import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent implements OnInit {

  option:string
  titulo:string

  constructor(public router:Router, public route:ActivatedRoute) { 
    this.route.params.subscribe(params => this.option = params['id'])
  }

  ngOnInit() {
    if(this.option == "termos"){
      this.titulo = "Termos e condições de uso"
      document.getElementById("termos").className = "d-block"
    } else if (this.option == "perguntas") {
      this.titulo = "Perguntas frequentes"
      document.getElementById("perguntas").className = "d-block"
    } else if (this.option == "sobre") {
      this.titulo = "Sobre o app"
      document.getElementById("sobre").className = "d-block"
    }
  }
}
