import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders, FirebaseAuthState, AuthMethods } from 'angularfire2';
import { LoginPage } from '../pages/login/login';
import { Observable, Subscription } from "rxjs/Rx";
import firebase from 'firebase';


@Injectable()
export class AuthService {
  fireAuth: any;

  constructor (public af: AngularFire) {
  }

  loginUser (mail: string, pwrd: string): firebase.Promise<FirebaseAuthState> {
    return this.af.auth.login({
      email: mail,
      password: pwrd
    });
  }

  loginAnonymous() {
    return this.af.auth.login({
      provider: AuthProviders.Anonymous,
      method: AuthMethods.Anonymous,
    });
  }

  logoutUser(): void {
    this.af.auth.logout();
  }

  signupUser(mail: string, pwrd: string): any {
    return this.af.auth.createUser({ email: mail, password: pwrd });
  }

  resetPassword(email: string): firebase.Promise<any> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  //We need to subcribe to userID in items sevice as the uid there has to be
  //correct al all times
  getUserID(): Observable<string> {
    return this.af.auth.map(user => {
      if(user) {
        return user.uid;
      }
      return null;
    });
  }

}
