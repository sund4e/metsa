import { FormControl } from '@angular/forms';

export class EmailValidator {
  static isValid(control: FormControl){
    var regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(control.value);

    if (regExp){
      return null;
    }
    return {"invalidEmail": true};
  }
}
