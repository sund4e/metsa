import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
// import {LoadingController} from 'ionic-angular';
import {ItemsService} from '../../providers/items-service';
import { Geolocation } from 'ionic-native';


@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  itemList: any;
  searching: boolean = true;

  constructor(
    public navCtrl: NavController,
    public itemService: ItemsService,
    public viewCtrl: ViewController
  ) {
    Geolocation.getCurrentPosition().then((resp) => {
       this.getItems(resp.coords.latitude, resp.coords.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
      this.itemList = itemService.getItems();
    });

  }

  getItems(latitude, longitude) {
    this.itemList = this.itemService.getSortedItems(latitude, longitude)
    this.itemList.subscribe(list => {
      this.searching = false;
    });
      // .subscribe(list => {
      //   this.searching = false;
      // });
    // console.log(this.itemList);
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }



}
