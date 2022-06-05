import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { Platform } from '@ionic/angular';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Tab2Page } from './tab2/tab2.page';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { environment } from '../environments/environment';
import { Tab3Page } from './tab3/tab3.page';
import { TabsPage } from './tabs/tabs.page';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    HttpClientModule,
    AngularFireStorageModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, Tab2Page,Platform, TabsPage, Tab3Page, NgbModalConfig,
    NgbModal, Clipboard],
  bootstrap: [AppComponent]

})
export class AppModule {}
