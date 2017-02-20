import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { MapPage } from '../pages/map-page/map-page';
// import { Page2 } from '../pages/page2/page2';
import {AddLocationPage} from '../pages/add-location/add-location';
import {ListPage} from '../pages/list/list';
// import { TabsPage } from '../pages/tabs/tabs';
import {SettingsPage} from '../pages/settings/settings';
import {MapComponent} from '../components/map/map';
// import { AUTOCOMPLETE_DIRECTIVES, AUTOCOMPLETE_PIPES } from 'ionic2-auto-complete';
import {SpeciesService} from '../providers/species-service';
import {ItemsService} from '../providers/items-service';
import {ToastService} from '../providers/toast-service';

import {MomentModule} from 'angular2-moment';



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
    MapPage,
    // Page2,
    MapComponent,
    AddLocationPage,
    ListPage,
    SettingsPage
    // TabsPage
    // AUTOCOMPLETE_DIRECTIVES,
    // AUTOCOMPLETE_PIPES
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    MomentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MapPage,
    // Page2,
    AddLocationPage,
    ListPage,
    SettingsPage,
    // TabsPage,
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SpeciesService,
    ItemsService,
    ToastService
  ]
})
export class AppModule {}
