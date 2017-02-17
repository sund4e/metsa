// import { FormControl } from '@angular/forms';
// // import {Injector} from 'angular2/core'
// import {SpeciesService} from '../providers/species-service';
// // import { forwardRef } from '@angular/core';
//
// // function validateSpecies(speciesService: SpeciesService) {
// //   return (control: FormControl) => {
// //     let validSpeciesNames = speciesService.getSpeciesList();
// //
// //     if (validSpeciesNames.indexOf(control.value.toLowerCase()) == -1){
// //       return {
// //           "not valid species": true
// //       };
// //     };
// //     return null;
// //   };
// // }
//
// export class SpeciesValidator {
//   // validator: Function;
//   //
//   // constructor(speciesService: SpeciesService) {
//   //   this.validator = validateSpecies(speciesService)
//   // }
//
//   isValid(control: FormControl): any {
//     // return this.validator(control)
//     if (control.value > 120){
//         return {
//             "not realistic": true
//         };
//     }
//
//     return null;
//   }
//
// }

import {SpeciesService} from '../providers/species-service';
import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, FormControl, Validator } from '@angular/forms';

@Directive({
  selector: '[checkSpecies][ngModel],[checkSpecies][formControl]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => SpeciesValidator), multi: true }
  ]
})
export class SpeciesValidator implements Validator {


  constructor(public speciesService: SpeciesService) {
  }

  getValidSpecies() {
    return this.speciesService.getSpeciesList();
  };

  validate(c: FormControl) {
    let validSpeciesNames = this.getValidSpecies()
    if (validSpeciesNames.indexOf(c.value.toLowerCase()) == -1){
      return {
          "not valid species": true
      };
    };
    return null;
  }
}

// export class SpeciesValidator {
//   // validator: Function;
//   // testi: any = "jjeeje"
//   //
//   // constructor(speciesService: SpeciesService) {
//   //   this.validator = this.validateSpecies(speciesService)
//   // }
//
//   static isValid(control: FormControl, speciesService: SpeciesService): any {
//     // return this.validator(control)
//
//     console.log(speciesService);
//     if (control.value > 120){
//         return {
//             "not realistic": true
//         };
//     }
//
//     return null;
//   }
//
//   // function validateSpecies(speciesService: SpeciesService) {
//   //   return (control: FormControl) => {
//   //     let validSpeciesNames = speciesService.getSpeciesList();
//   //
//   //     if (validSpeciesNames.indexOf(control.value.toLowerCase()) == -1){
//   //       return {
//   //           "not valid species": true
//   //       };
//   //     };
//   //     return null;
//   //   };
//   // }
