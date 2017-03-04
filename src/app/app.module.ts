import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ResetPasswordPage } from '../pages/reset-password/reset-password'
import { MapPage } from '../pages/map-page/map-page';
import {AddLocationPage} from '../pages/add-location/add-location';
import {ListPage} from '../pages/list/list';
import {SettingsPage} from '../pages/settings/settings';
import { MapComponent} from '../components/map/map';
import { SpeciesService } from '../providers/species-service';
import {ItemsService} from '../providers/items-service';
import {ToastService} from '../providers/toast-service';
import { AuthService } from '../providers/auth-service';

import {MomentModule} from 'angular2-moment';
import { Ionic2RatingModule } from 'ionic2-rating';



import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
export const firebaseConfig = {
  apiKey: "AIzaSyCUIIHRPGlHaPf-_4Wv4XwhkNe1JMbFXJ8",
    authDomain: "metsa-3b8ec.firebaseapp.com",
    databaseURL: "https://metsa-3b8ec.firebaseio.com",
    storageBucket: "metsa-3b8ec.appspot.com",
    messagingSenderId: "966664460758"
};
//Email & password provider for authentication
const myFirebaseAuthConfig = {
    provider: AuthProviders.Password,
    method: AuthMethods.Password
}

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    MapPage,
    MapComponent,
    AddLocationPage,
    ListPage,
    SettingsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig),
    MomentModule,
    Ionic2RatingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    MapPage,
    AddLocationPage,
    ListPage,
    SettingsPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SpeciesService,
    ItemsService,
    ToastService,
    AuthService
  ]
})
export class AppModule {}
