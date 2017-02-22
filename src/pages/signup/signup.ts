import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { EmailValidator } from '../../validators/email-validator';
import { AuthService } from '../../providers/auth-service';
import { ToastService } from '../../providers/toast-service';
import { MapPage} from '../map-page/map-page';

/*
  Generated class for the Signup page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  submitAttempt: boolean = false;
  signupForm: any;
  loading: any;

  constructor(
    public nav: NavController,
    public auth: AuthService,
    public toast: ToastService,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController
  ) {
    this.signupForm = formBuilder.group({
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

  createUser() {
    this.submitAttempt = true;

    this.auth.signupUser(this.signupForm.value.email, this.signupForm.value.password)
    .then( authData => {
      this.nav.setRoot(MapPage);
    }, (error: any) => {
      this.loading.dismiss().then(() => {
        console.log(error);
        if (error.code == 'auth/email-already-in-use') {
          this.toast.showFail('Sähköpostiosoite on jo käytössä');
        } else {
          this.toast.showFail('Virhe tilin luonnissa: ' + error.message);
        }
      });
    });

    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    this.loading.present();
  }

}
