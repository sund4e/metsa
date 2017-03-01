import { Component } from '@angular/core';
import { NavController, NavParams, ViewController} from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { LoginPage } from '../login/login';

/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public auth: AuthService, public viewCtrl: ViewController) {}

  logout() {
    this.navCtrl.setRoot(LoginPage);
    this.auth.logoutUser();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
