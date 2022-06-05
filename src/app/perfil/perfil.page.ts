import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreCollectionGroup   } from '@angular/fire/compat/firestore';
import { Tab2Page } from '../tab2/tab2.page';
import { AngularFireStorage  } from '@angular/fire/compat/storage';
import { TabsPage } from '../tabs/tabs.page';

interface Imagem  {
  avatar: string;
}
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {
  public quantGarrafa: number;
  public quantLatinha: number;
  public quantPapel: number;
  public quantOleo: number;
  public pontos: number;
  public imagemFundo: boolean;
  public array: [];
  public fileToUpload: File = null;
  private usuarioId: AngularFirestoreCollection<Imagem>;
  

  constructor(
    public router: Router,
      private readonly afs: AngularFirestore,
      private storage: AngularFireStorage,
      public tabInfo: TabsPage,
      public tabInfoPontos: Tab2Page) {
        this.imagemFundo = false;
        setTimeout(()=>{
          this.imagemFundo = true;
        }, 3000)
  }


  navegar(url: string , rotaPrincipal?){
    if(rotaPrincipal){
      this.tabInfo.selectMenu(`/${url}`);
    }
    this.router.navigateByUrl(`/${url}`);
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    if(this.fileToUpload !== null){
      const upload = this.storage.ref(`usuarios/${localStorage.token}/${localStorage.token}`).put(this.fileToUpload);

      upload.snapshotChanges().subscribe(photo => {
        photo.ref.getDownloadURL().then( (avatar) => {
          this.usuarioId = this.afs.collection<Imagem>(`usuarios/${localStorage.token}/informacoes`);
          this.usuarioId.doc(localStorage.token).update({ avatar });;
        });
      });
    }
  }
}
