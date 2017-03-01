import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { EmailValidator } from '../../validators/email-validator';
import { AuthService } from '../../providers/auth-service';
import { ToastService } from '../../providers/toast-service';
import { MapPage} from '../map-page/map-page';
import { SignupPage } from '../signup/signup';


/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  submitAttempt: boolean = false;
  loginForm: any;
  loading: any;

  constructor(
    public nav: NavController,
    public auth: AuthService,
    public toast: ToastService,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController
  ) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        EmailValidator.isValid
      ])],
      password: ['', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])]
    });
  }

  goToResetPassword(){
    // check help from here: https://javebratt.com/angularfire2-email-auth/
    // this.nav.push(ResetPasswordPage);
  }

  createAccount(){
      this.nav.push(SignupPage);
  }

  loginUser(){
    this.submitAttempt = true;

    if (!this.loginForm.valid){
      console.log(this.loginForm.value);
    } else {
      this.auth.loginUser(this.loginForm.value.email, this.loginForm.value.password)
      .then( authData => {
        this.nav.setRoot(MapPage);
      }, (error: any) => {
        this.loading.dismiss().then(() => {
          if (error.code == 'auth/user-not-found') {
            this.toast.showFail('Sähköpostiosoitetta vastaavaa tiliä ei löydy');
          } else if (error.code == 'auth/wrong-password') {
            this.toast.showFail('Väärä salasana');
          } else {
            this.toast.showFail('Virhe kirjautumisessa: ' + error.message);
          }
        });
      });
      this.showLoading();
    }
  }

  loginAnonymous() {
    this.auth.loginAnonymous()
      .then( authData => {
        this.nav.setRoot(MapPage);
      }, error => {
        this.loading.dismiss().then( error => {
          this.toast.showFail('Virhe kirjautumisessa: ' + error.message)
        });
    });

    this.showLoading();
  }


  showLoading() {
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    this.loading.present();
  }

  log(e) {
    console.log(this.loginForm.controls.email.value);
    console.log(this.loginForm.controls.email.value == '');
  }

}
