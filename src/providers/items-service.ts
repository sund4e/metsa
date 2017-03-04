import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs/Rx";
import 'rxjs/add/operator/map';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { ToastService } from './toast-service';
import { AuthService } from './auth-service';
import { Item } from '../models/item';
// import GeoFire from 'geofire'; Geofire should be ready to use
import * as _ from 'lodash';


@Injectable()
export class ItemsService {
  uid: string
  itemList: FirebaseListObservable<any>;


  constructor(
    public auth: AuthService,
    public af: AngularFire,
    public toast: ToastService
  ) {
      //Subscribing ensures that uid is up to date at all times
      let observable = this.auth.getUserID()
      observable.subscribe(uid => {
        this.uid = uid;
        this.itemList = af.database.list('/users/' + this.uid)
        console.log('itemList establsihed: /users/' + this.uid);
      });
  }

  getItems (): Observable<Item[]> {
    return this.itemList
      .map(Item.fromJsonList);
  }

  getItem(id: string): Observable<Item> {
    return this.af.database.object('/users/' + this.uid + '/' + id)
      .map(Item.fromJson);
  }

  getSortedItems(currLat, currLng) {
    return this.itemList
    .map(Item.fromJsonList)
    .map(items => {
      return items
        .map(item => {
          item.distance = this.calculateDistance(
            currLat, currLng, item.latLng.lat, item.latLng.lng
          );
          return item;
        })
        .sort(this.compareDistance)
    });
  };

  addItem (item: Item) {
    return this.itemList.push(item)
    .then(response => {
      this.toast.showSuccess('Apaja tallennettu');
    }, error => {
      this.toast.showFail('Virhe apajan lisäämisessä: ' + error);
    });
  }

  deleteItem(id:string) {
    return this.itemList.remove(id)
    .then(response => {
      console.log(response);
      this.toast.showSuccess('Apaja poistettu');
    }, error => {
      this.toast.showFail('Virhe apajan poistossa: ' + error);
    });
  }

  updateItem(id: string, updates: any) {
    console.log(id);
    return this.itemList.update(id, updates)
    .then(response => {
      console.log(response);
      this.toast.showSuccess('Muokkaus tallennettu');
    }, error => {
      this.toast.showFail('Virhe apajan muokkauksessa: ' + error);
    });
  }

  //http://www.geodatasource.com/developers/javascript
  calculateDistance(lat1, lon1, lat2, lon2) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    dist = dist * 1.609344
    return dist
  }

  compareDistance(a, b) {
    return a.distance - b.distance
  }

}
