import {Component, Output, EventEmitter} from '@angular/core';
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
  // @ViewChild('map') map;
  @Output() selectedLocation = new EventEmitter();
  map: any;
  loading: any;
  marker: any;

  constructor (public loadingCtrl: LoadingController) {}

  ngAfterViewInit() {
    this.loading = this.showLoading();
    console.log('init');
    //load map doesn't fire without timeout TODO: any other workaroud?
    setTimeout(this.loadMap.bind(this), 100);
  }

  loadMap() {
    console.log('loadMap:');
    this.map = L
      .map('map', {zoomControl: false})
      .locate({setView: true, maxZoom: 16})
      .whenReady(this.dismissLoading.bind(this))
      .on('contextmenu', this.selectLocation.bind(this))
      .on('click', this.clearLocationSelection.bind(this))
      .on('locationerror', this.handleLocationError.bind(this));

    Tangram
      .leafletLayer({
          scene: {
            import: 'https://mapzen.com/carto/walkabout-style-more-labels/walkabout-style-more-labels.yaml',
            global: { sdk_mapzen_api_key: 'mapzen-xe5PErc' }
          },
          // allowCrossDomainWorkers: true
          attribution: '© <a href="https://www.mapzen.com/rights">Mapzen</a>, \
            <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>, \
            and <a href="https://www.mapzen.com/rights/#services-and-data-sources">others</a>'
      })
      .addTo(this.map);

    L.control.geocoder('mapzen-xe5PErc', {
      markers: false,
      attribution: null
    })
      .addTo(this.map)
      .on('select', this.selectLocation.bind(this));

    L.control.locate({
      position: 'topleft',
      keepCurrentZoomLevel: true,
      icon: 'fa fa-compass'
    }).addTo(this.map);

    // L.easyButton({
    //   id: 'id-for-the-button',  // an id for the generated button
    //   position: 'bottomleft',      // inherited from L.Control -- the corner it goes in
    //   type: 'animate',          // set to animate when you're comfy with css
    //   leafletClasses: true,     // use leaflet classes to style the button?
    //   states:[{                 // specify different icons and responses for your button
    //     stateName: 'get-center',
    //     onClick: function(button, map){
    //       console.log('YAY!');
    //     },
    //     title: 'show me the middle',
    //     icon: '<button ion-button>Nappula</button>'
    //   }]
    // }).addTo(this.map);

  }

  showLoading () {
    let loading = this.loadingCtrl.create({
      content: 'Hetki vain, ladataan karttaa...'
    });
    loading.present();
    return loading;
  }

  dismissLoading() {
    this.loading.dismiss()
  }

  selectLocation(e) {
    this.clearLocationSelection();
    this.marker = new L.Marker(e.latlng);
    this.marker.addTo(this.map);
    this.selectedLocation.emit(e.latlng);
  }

  clearLocationSelection() {
    if(this.marker) {
      this.map.removeLayer(this.marker);
      this.marker = undefined;
      this.selectedLocation.emit(false);
    };
  }

  //TODO:alert user
  handleLocationError(e) {
    this.map.setView([64, 26], 5);
    console.log('Location error:')
    console.log(e.message);
  }
}
