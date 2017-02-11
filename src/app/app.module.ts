import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import {MapComponent} from '../components/map/map';

import { AngularFireModule } from 'angularfire2';
export const firebaseConfig = {
  apiKey: "AIzaSyCUIIHRPGlHaPf-_4Wv4XwhkNe1JMbFXJ8",
    authDomain: "metsa-3b8ec.firebaseapp.com",
    databaseURL: "https://metsa-3b8ec.firebaseio.com",
    storageBucket: "metsa-3b8ec.appspot.com",
    messagingSenderId: "966664460758"
};

@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    MapComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
