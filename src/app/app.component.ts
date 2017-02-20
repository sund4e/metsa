import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
// import { TabsPage } from '../pages/tabs/tabs';

import { MapPage } from '../pages/map-page/map-page';
// import { Page2 } from '../pages/page2/page2';
import { ListPage } from '../pages/list/list';
import { SettingsPage} from '../pages/settings/settings';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // rootPage: any = TabsPage;
  rootPage: any = MapPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform) {
    this.initializeApp();

    //used for an example of ngFor and navigation
    this.pages = [
      { title: 'Page One', component: MapPage },
      { title: 'Lista', component: ListPage }
      // { title: 'Page Two', component: Page2 }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  // openPage(page) {
  //   // Reset the content nav to have just this page
  //   // we wouldn't want the back button to show in this scenario
  //   this.nav.setRoot(page.component);
  // }
}
