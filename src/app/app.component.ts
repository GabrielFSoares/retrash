import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Location } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    public router: Router,
    public toastController: ToastController,
    private platform: Platform,
    private location: Location
  ) {


    this.verificarToken();
    this.platform.backButton.subscribeWithPriority(-1, () => {

      // eslint-disable-next-line @typescript-eslint/dot-notation
      this.location.back();
      console.log(this.router.url);
      if (this.router.url === '/tabs/tab2') {
        navigator['app'].exitApp();
        return;
      }
    });
  }

  verificarToken() {
    if (localStorage.token != null) {
      this.router.navigateByUrl('/tabs');
    }
  }



  async exibeMensagem(mensagem: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 4000
    });
    toast.present();
  }
}
