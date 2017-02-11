import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
// import {MapComponent} from '../../components/map/map'
// import * as mapz from 'mapzen.js'
// import * as L from 'leaflet'

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {

  constructor(public navCtrl: NavController) {
    // // Add a map to the 'map' div
    // var map = L.Mapzen.map('map');
    // // Set the center of the map to be the San Francisco Bay Area at zoom level 12
    // map.setView([37.7749, -122.4194], 12);
  }

}
