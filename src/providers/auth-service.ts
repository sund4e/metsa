import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders, FirebaseAuthState, AuthMethods } from 'angularfire2';
import { LoginPage } from '../pages/login/login';
import firebase from 'firebase';


@Injectable()
export class AuthService {
  fireAuth: any;

  constructor (public af: AngularFire) {
    af.auth.subscribe( user => {
      if (user) {
        this.fireAuth = user.auth;
        console.log(this.fireAuth);
      }
    });
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

  isAuthenticated() {
    if (this.fireAuth) {
      return true;
    }
    return false;
  }

  getUserID() {
    return this.fireAuth.uid;
  }

}
