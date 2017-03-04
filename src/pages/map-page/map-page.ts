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
import { LatLng } from '../../models/latlng';
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
  latLng: LatLng; //Selected location (no item selected)
  itemList: Item[]; //Item objects saved to firebase, passed to map component
  item: Observable<Item>; //Selected item (no location selected)
  itemListObservable: Observable<Item[]> //firebase observable
  itemSubscription: Subscription; //Subscription to the item list from firebase
  locationSubscription: Subscription; //Subscription to the current location
  hiddenFooter: boolean = false;

  //TODO: test that itemList is updated when items updated in firebase
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public itemService: ItemsService,
    public alert: AlertController,
    public toast: ToastService
  ) {
    this.itemListObservable = this.itemService.getItems();
    this.itemSubscription = this.itemListObservable.subscribe((list) => {
      this.itemList = list;
    });

    // let locationSuccess = (position) => {
    //   console.log('Location found!!');
    //   console.log(position);
    //   this.itemListObservable = this.itemService.getSortedItems(
    //     position.coords.latitude, position.coords.longitude
    //   )
    //   this.itemSubscription = this.itemListObservable.subscribe((list) => {
    //     this.itemList = list;
    //   });
    // }
    //
    // let locationError = (error) => {
    //   console.log('Location not found :(');
    //   console.log(error.message);
    //   if(error.TIMEOUT) {
    //     this.toast.showFail('Sijaintietoa ei löytynyt');
    //   } else if (error.POSITION_UNAVAILABLE) {
    //     this.toast.showFail('Satelliittipaikannukseen ei saatu yhteyttä')
    //   } else if(error.PERMISSION_DENIED) {
    //     this.toast.showFail(
    //       'Ei käyttöoikeutta sijaintitietoihin, takista puhelimen asetukset'
    //     )
    //   } else {
    //     this.toast.showFail(error.message)
    //   }
    //   this.itemListObservable = this.itemService.getItems();
    //   this.itemSubscription = this.itemListObservable.subscribe((list) => {
    //     this.itemList = list;
    //   });
    // }
    //
    // /*
    // Needs timeout as otherwise the locationError callback will not be fired
    // MaxAge acceps a cached position no older than speciefied
    // https://github.com/apache/cordova-plugin-geolocation
    // */
    // navigator.geolocation.watchPosition(
    //   locationSuccess, locationError, {
    //     enableHighAccuracy: true,
    //     maximumAge: 5000,
    //     timeout: 10000
    //   }
    // );
  }

  /*
  TODO: test that unsubscribes from the subscriptions. Otherwise,
  if user signs out when subscribed, tries to access the items in firebase
  and throws an error
  */
  ionViewDidLeave() {
    this.itemSubscription.unsubscribe();
    this.locationSubscription.unsubscribe();
  }

  //Item needs to be passed to map component
  showItemBar(id) {
    this.latLng = undefined;
    this.item = this.itemService.getItem(id);
  }

  /*
  TODO: test that itemId is also unset as we need to fire ngOnChange in the
  mapcomponent so that the markers are showed corretly
  TODO: any better way to pass the itemId to mapcomponent?
  */
  selectLocation(latLng: LatLng) {
    this.item = undefined;
    // this.itemId = undefined;
    if(latLng) {
      this.latLng = latLng;
    } else {
      this.latLng = undefined;
    }
  }

  hideFooter(event: boolean) {
    this.hiddenFooter = event;
  }

  openEditItemModal() {
    let modal;
    if (this.item) {
      this.item.subscribe((item) => {
        modal = this.modalCtrl.create(AddLocationPage, { item: item });
      }).unsubscribe();
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
          }
        },
        {
          text: 'Poista',
          handler: () => {
            this.deleteItem(this.item);
          }
        }
      ]
    });
    alert.present();
  }

  deleteItem(observable: Observable<Item>) {
    observable.subscribe((item) => {
      this.itemService.deleteItem(item.$key);
      this.item = undefined;
    });
  }

  //TODO:test that item bar is only opened if an item is passed when modal closes
  //TODO: test that itemListObservable is passed to navParams
  openListModal(latLng) {
    let sortedItems = this.itemService.getSortedItems(latLng.lat, latLng.lng);
    let modal = this.modalCtrl.create(ListPage, {itemList: sortedItems});
    modal.onDidDismiss(id => {
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
