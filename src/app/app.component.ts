import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { AngularFire } from 'angularfire2';
import { MapPage } from '../pages/map-page/map-page';
import { LoginPage } from '../pages/login/login';
import { Geolocation } from 'ionic-native';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // rootPage: any = TabsPage;
  rootPage: any;

  // pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public af: AngularFire) {
    //Send unautheticated users to Login
    const authObserver = af.auth.subscribe( user => {
      this.rootPage = MapPage;
      console.log(user);
      if (user) {
        this.rootPage = MapPage;
        authObserver.unsubscribe();
      } else {
        this.rootPage = LoginPage;
        authObserver.unsubscribe();
      }
    });


    this.initializeApp();

    //used for an example of ngFor and navigation
    // this.pages = [
    //   { title: 'Map', component: MapPage },
    //   { title: 'Lista', component: ListPage }
    //   // { title: 'Page Two', component: Page2 }
    // ];

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
