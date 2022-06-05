import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getAuth } from "firebase/auth";
import { Observable } from 'rxjs';
import { doc, getDoc } from "firebase/firestore";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreCollectionGroup } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-informations',
  templateUrl: './informations.component.html',
  styleUrls: ['./informations.component.scss'],
})
export class InformationsComponent implements OnInit {

  option:string
  title:string
  message:string

  private db: AngularFirestoreCollectionGroup;
  private allInfo: Observable<any>;

  constructor(public router:Router, public route:ActivatedRoute, private afs:AngularFirestore) { 
    this.route.params.subscribe(params => this.option = params['id'])
    this.db = this.afs.collectionGroup('informacoes', ref => ref.where('id', '==', localStorage.token))
    this.allInfo = this.db.valueChanges()
  }

  ngOnInit() {
    if(this.option == "reciclar"){
      this.title = "O que reciclar?"
      document.getElementById("reciclar").className = "d-block"
    } else if (this.option == "funciona") {
      this.title = "Como funciona?"
      document.getElementById("funciona").className = "d-block"
    } else if (this.option == "estatisticas") {
      this.title = "Estatísticas gerais"
      document.getElementById("estatisticas").className = "d-block"
    } else if (this.option == "suporte") {
      this.title = "Fale conosco"
      document.getElementById("suporte").className = "d-block"
    }
  }

  sentMessage() {

    const auth = getAuth();
    const user = auth.currentUser;

    this.allInfo.subscribe(info => {
      console.log(info);
      console.log("novamente 232");
    });

    console.log(user)
    console.log(this.message)
  }

}
