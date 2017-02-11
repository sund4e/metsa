import {Component, ViewChild} from '@angular/core';
import {Http} from '@angular/http';
import {LoadingController} from 'ionic-angular';
import L from 'leaflet';
import 'leaflet.locatecontrol';
import 'leaflet-geocoder-mapzen';
import 'leaflet-easybutton'

// declare var L: any;
declare var Tangram: any;
// declare var control: any;

@Component({
  selector: 'map-component',
  templateUrl: 'map.html',
  providers: [Http]
})

export class MapComponent {
  @ViewChild('map') map;

  constructor (public loadingCtrl: LoadingController) {}

ngAfterViewInit() {
  let loading = this.showLoading();

  var map = L.map('map', {
    zoomControl: false
  });

  var layer = Tangram.leafletLayer({
      scene: {
        import: 'https://mapzen.com/carto/walkabout-style-more-labels/walkabout-style-more-labels.yaml',
        global: { sdk_mapzen_api_key: 'mapzen-xe5PErc' }
      },
      // allowCrossDomainWorkers: true
      attribution: '© <a href="https://www.mapzen.com/rights">Mapzen</a>, \
        <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>, \
        and <a href="https://www.mapzen.com/rights/#services-and-data-sources">others</a>'
  });
  layer.addTo(map);

  L.control.locate({
    position: 'bottomright',
    keepCurrentZoomLevel: true,
    icon: 'fa fa-compass'
  }).addTo(map);

  L.control.geocoder('mapzen-xe5PErc', {
    attribution: null
  }).addTo(map);

  L.easyButton('fa-globe', function(btn, map){
    console.log('YAY!');
  }).addTo(map);

  map.locate({setView: true, maxZoom: 16});
  map.whenReady(() => {
    loading.dismiss()
  });
 }

 showLoading () {
   let loading = this.loadingCtrl.create({
     content: 'Getting the map...'
   });
   loading.present();
   return loading;
 }
}
