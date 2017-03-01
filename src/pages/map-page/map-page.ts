import { Component, ViewChild } from '@angular/core';
import { NavController, Content, ModalController, AlertController } from 'ionic-angular';
import {style, state, animate, transition, trigger} from '@angular/core';
// import { FirebaseListObservable} from 'angularfire2';
import {AddLocationPage} from '../add-location/add-location';
import { ListPage } from '../list/list';
import { SettingsPage } from '../settings/settings';
import { ItemsService } from '../../providers/items-service';
import { ToastService } from '../../providers/toast-service';
import { Item } from '../../models/item';
import { Observable, Subscription, Subject } from "rxjs/Rx";
import { Geolocation } from 'ionic-native';
import * as moment from 'moment';

@Component({
  selector: 'map-page',
  templateUrl: 'map-page.html',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({transform: 'translateY(100%)'}),
        animate(500)
        // style({opacity:0}),
        // animate(500, style({opacity:1}))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(500, style({transform: 'translateY(100%)'}))
        // animate(500, style({opacity:0}))
      ])
    ])
  ]
})
export class MapPage {
  // @ViewChild(Content) content: Content;
  latLng: Array<number>; //Selected location (no item selected)
  itemList: Item[]; //Item objects saved to firebase, passed to map component
  item: Observable<Item>; //Selected item (no location selected)
  itemId: string; //ID of the selected item (passed to map component)
  itemListObservable: Observable<Item[]> //firebase observable
  itemSubscription: Subscription; //Subscription to the item list from firebase
  locationSubscription: Subscription; //Subscription to the current location

  //TODO: test that itemList is updated when items updated in firebase
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public itemService: ItemsService,
    public alert: AlertController,
    public toast: ToastService
  ) {
    this.locationSubscription = Geolocation.watchPosition()
    // .filter((p) => p.coords !== undefined) //Filter Out Errors
    .subscribe(position => {
      if (!position.coords) {
        toast.showFail('Sijaintitiedot ei saatavissa')
        console.log('error getting location:')
        console.log(position)
        this.itemListObservable = itemService.getItems();
      } else {
        this.itemListObservable = itemService.getSortedItems(
          position.coords.latitude, position.coords.longitude
        );
      }
      this.itemSubscription = this.itemListObservable.subscribe((list) => {
        this.itemList = list;
      });
    });

  }

  /*
  TODO: test that unsubscribes from the subscriptions. Otherwise,
  if user signs out when subscribed, tries to access the items in firebase
  and throws an error
  */
  ionViewDidLeave() {
    console.log('map-page.ts did leave');
    this.itemSubscription.unsubscribe();
    this.locationSubscription.unsubscribe();
  }

  showItemBar(id) {
    this.latLng = undefined;
    this.item = this.itemService.getItem(id);
    let subscription = this.item.subscribe((item) => {
      console.log('itemid changed');
      this.itemId = item.$key;
    });
    subscription.unsubscribe();
  }

  /*
  TODO: test that itemId is also unset as we need to fire ngOnChange in the
  mapcomponent so that the markers are showed corretly
  TODO: any better way to pass the itemId to mapcomponent?
  */
  selectLocation(latLng) {
    this.item = undefined;
    this.itemId = undefined;
    if(latLng) {
      this.latLng = latLng;
    } else {
      this.latLng = undefined;
    }
  }

  openEditItemModal() {
    let modal;
    if (this.item) {
      let subscription = this.item.subscribe((item) => {
        modal = this.modalCtrl.create(AddLocationPage, { item: item });
      });
      subscription.unsubscribe();
    } else {
      modal = this.modalCtrl.create(AddLocationPage, { latLng: this.latLng });
    }
    modal.onDidDismiss(data => {
     this.latLng = undefined;
    });
    modal.present();
  }

  deleteItemAlert() {
    let alert = this.alert.create({
      title: 'Poista apaja',
      message: 'Oletko varma että haluat poistaa apajan?',
      buttons: [
        {
          text: 'Peruuta',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            // alert.dismiss();
          }
        },
        {
          text: 'Poista',
          handler: () => {
            console.log('Buy clicked');
            this.deleteItem(this.item);
          }
        }
      ]
    });
    alert.present();
  }

  deleteItem(observable: Observable<Item>) {
    let subscription = observable.subscribe((item) => {
      this.itemService.deleteItem(item.$key);
      this.item = undefined;
    });
  }

  //TODO:test that item bar is only opened if an item is passed when modal closes
  //TODO: test that itemListObservable is passed to navParams
  openListModal() {
    let modal = this.modalCtrl.create(ListPage, {itemList: this.itemListObservable});
    modal.onDidDismiss(id => {
      console.log(id);
      if(id) {
        this.showItemBar(id);
      }
    });
    modal.present();
  }

  /*
  TODO: Check that ionViewDidLeave fires when going to settings page
  User can log out from settings page, it's crucial that we unsubscribe from
  the items
  */
  openSettingsModal() {
    this.navCtrl.push(SettingsPage);
  }

}
