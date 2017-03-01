import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import {ItemsService} from '../../providers/items-service';
import { Item } from '../../models/item';
import { Observable, Subscription, Subject } from "rxjs/Rx";
// import { Geolocation } from 'ionic-native';


@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  itemList: Observable<Item[]>;
  ratingFilter: number;
  searchFilter: string;
  searching: boolean = true;
  subscription: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public itemService: ItemsService,
    public viewCtrl: ViewController
  ) {
    this.initItems()
  }

  initItems() {
    this.itemList = this.navParams.get('itemList');
  }

  getSearchReults(e: any) {
    this.initItems();
    this.searchFilter = e.target.value;
    this.filter();
  }

  getRatingResults(rating: number) {
    this.initItems();
    if(this.ratingFilter == rating) {
      this.ratingFilter = undefined;
      return;
    }
    this.ratingFilter = rating;
    this.filter()
  }

  filter() {
    console.log('------------');
    console.log(this.searchFilter);
    console.log(this.ratingFilter);
    this.filterSpecies();
    this.filterRating();
  }

  filterSpecies() {
    if (this.searchFilter && this.searchFilter.trim() != '') {
      this.itemList = this.itemList
      .map(itemList => {
        return itemList.filter((item) => {
          return (item.species.toLowerCase().indexOf(
            this.searchFilter.toLowerCase()) > -1);
        });
      });
    }
  }

  //TODO: test that checks that this.ratingFilter exists
  filterRating() {
    if (this.ratingFilter) {
      this.itemList = this.itemList
      .map(itemList => {
        return itemList.filter((item) => {
          return (item.rating == this.ratingFilter);
        });
      });
    }
  }

  dismiss(item: Item = null) {
    if(item) {
      this.viewCtrl.dismiss(item.$key);
    } else {
      this.viewCtrl.dismiss();
    }
  }
}
