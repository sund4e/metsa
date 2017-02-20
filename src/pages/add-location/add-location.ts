import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import {SpeciesService} from '../../providers/species-service';
import {ItemsService} from '../../providers/items-service';

import * as _ from 'lodash';
import * as moment from 'moment';


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
    private speciesService: SpeciesService,
    private itemsService: ItemsService
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

  dismiss() {
    this.viewCtrl.dismiss();
  }

  logForm(){
    let item = this.form.value;
    item.latLng = this.navParams.get('latLng');
    item.time = moment();
    this.itemsService.addItem(this.form.value)
    .then(response => {
      this.dismiss()
    })
    .catch(err => console.log(err, 'You do not have access!'));
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
