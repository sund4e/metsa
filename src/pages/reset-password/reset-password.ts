import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { EmailValidator } from '../../validators/email-validator';
import { AuthService } from '../../providers/auth-service';
import { ToastService } from '../../providers/toast-service';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html'
})
export class ResetPasswordPage {
  form: any;
  loading: any;

  constructor(
    public nav: NavController,
    public auth: AuthService,
    public toast: ToastService,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController
  ) {
    this.form = formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        EmailValidator.isValid
      ])]
    });
  }

  resetPassword() {
    this.auth.resetPassword(this.form.value.email)
    .then(
      (authData) => {
        this.nav.pop();
        this.toast.showFail('Salasana lähetetty sähköpostiin');
      },
      (error: any) => {
      this.loading.dismiss().then(() => {
        console.log(error);
        if (error.code == 'auth/user-not-found') {
          this.toast.showFail('Sähköpostiosoite ei vastaa yhtään käyttäjää, '+
          'tarkista osoite');
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
