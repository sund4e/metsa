import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { ToastService } from './toast-service';
import { AuthService } from './auth-service';
import * as _ from 'lodash';


/*
  Generated class for the ItemsService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ItemsService {
  itemList: FirebaseListObservable<any>;

  constructor(
    public auth: AuthService,
    public af: AngularFire,
    public toast: ToastService
  ) {
      let uid = this.auth.getUserID();
      this.itemList = af.database.list('/users/' + uid);
    // this.itemList
    //   .subscribe(snapshots => {
    //     snapshots.forEach(snapshot => {
    //       // console.log(snapshot.key)
    //       // console.log(snapshot)
    //     });
    //   })
  }

  getItems () {
    return this.itemList
  }

  getSortedItems(currLat, currLng) {
    return this.itemList.map(items => {
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

  getItem(id) {
    let item = this.af.database.list('/items/' + id);
    return item.subscribe(item => {
      return _.mapValues(_.keyBy(item, '$key'), property => {
        if(property.$value) {
          return property.$value;
        }
        return property;
      })
    });
  }

  addItem (object) {
    return this.itemList.push(object)
    .then(response => {
      console.log(response);
      this.toast.showSuccess('Apaja tallennettu');
    }, error => {
      console.log(error);
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
