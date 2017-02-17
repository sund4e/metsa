import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, TextInput } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
// import {AUTOCOMPLETE_DIRECTIVES} from 'ionic2-auto-complete';
import {SpeciesService} from '../../providers/species-service';
import { SpeciesValidator } from  '../../validators/species-validator';
import _ from 'lodash';

/*
  Generated class for the AddLocation page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-add-location',
  templateUrl: 'add-location.html',
})
export class AddLocationPage {
  form : FormGroup;
  suggestions : any;
  showList: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private speciesService: SpeciesService
  ) {
      this.form = this.formBuilder.group({
        species: ['', this.validateSpecies.bind(this)],
        notes: [''],
      });
    }

  listOptions(value) {
    console.log(value);
    if(value == '') {
      this.suggestions = [];
    } else {
      this.suggestions = _.map(this.speciesService.getResults(value), 'name');
    }
  }

  selectOption(selection) {
    this.suggestions = [];
    this.form.patchValue({species: selection});
  }

  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }

  logForm(){
    console.log(this.form.value)
  }

  validateSpecies(control: FormControl): any {
    console.log('validation');
    let validSpeciesNames = this.speciesService.getSpeciesList();
    if (validSpeciesNames.indexOf(control.value) == -1){
      return {
          "not valid species": true
      };
    };
    return null;
  }

}
