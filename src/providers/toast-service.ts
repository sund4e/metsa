import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {ToastController} from 'ionic-angular'


@Injectable()
export class ToastService {

  constructor(private toastCtrl: ToastController) {
  }

  showSuccess(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'top',
      dismissOnPageChange: true
    });

    toast.present();
  }

  showFail(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 30000,
      position: 'top',
      dismissOnPageChange: true,
      showCloseButton: true,
      closeButtonText: 'Sulje'
    });

    toast.present();
  }
}
