import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { SpeciesService } from '../../providers/species-service';
import { ItemsService } from '../../providers/items-service';
import { Item } from '../../models/item';
import { Observable, Subscription, Subject } from "rxjs/Rx";

import * as _ from 'lodash';
import * as moment from 'moment';


@Component({
  selector: 'page-add-location',
  templateUrl: 'add-location.html',
})
export class AddLocationPage {
  form : FormGroup;
  suggestions : any;
  item: Item;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private speciesService: SpeciesService,
    private itemsService: ItemsService
  ) {
    if(this.navParams.get('item')) {
      this.item = this.navParams.get('item');
      this.form = this.formBuilder.group({
        species: [this.item.species, this.validateSpecies.bind(this)],
        rating: [this.item.rating, Validators.required],
        notes: [this.item.notes],
      });
    } else {
      this.form = this.formBuilder.group({
        species: ['', this.validateSpecies.bind(this)],
        rating: ['', Validators.required],
        notes: [''],
      });
    }
  }

  listOptions(value) {
    console.log(value);
    if(value == '') {
      this.suggestions = [];
    } else {
      this.suggestions = _.map(this.speciesService.getResults(value), 'name');
      if(this.suggestions.length == 0) {
        this.suggestions.push('Ei vastaavia lajeja');
      }
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
    if(this.item) {
      this.editItem();
    } else {
      this.addItem();
    }
  }

  addItem() {
    let item = new Item(
      this.navParams.get('latLng'),
      this.form.value.species,
      this.form.value.notes,
      this.form.value.rating,
      moment().unix()
    );

    this.itemsService.addItem(item)
    .then(response => {
      this.dismiss();
    });
  }

  editItem() {
    let updates = {
      species: this.form.value.species,
      rating: this.form.value.rating,
      notes: this.form.value.notes,
      timestamp: moment().unix()
    }
    this.itemsService.updateItem(this.item.$key, updates)
    .then(response => {
      this.dismiss();
    });

  }

  validateSpecies(control: FormControl): any {
    let validSpeciesNames = this.speciesService.getSpeciesList();
    if (validSpeciesNames.indexOf(control.value) == -1){
      return {
          "not valid species": true
      };
    };
    return null;
  }

}
