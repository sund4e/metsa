import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Http} from '@angular/http';
import {LoadingController} from 'ionic-angular';
import { ToastService } from '../../providers/toast-service';
import { Diagnostic } from 'ionic-native';

// import 'rxjs/add/operator/contains';
// import { FirebaseListObservable} from 'angularfire2';
import { Observable, Subscription } from "rxjs/Rx";
import { Item } from '../../models/item';
import { LatLng } from '../../models/latlng';
import L from 'leaflet';
import 'leaflet.locatecontrol';
import 'leaflet-geocoder-mapzen';
import 'leaflet-easybutton';
import 'leaflet.markercluster';
import 'drmonty-leaflet-awesome-markers';
import * as _ from 'lodash';

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
  @Input() items: Item[];
  @Input() selectedItem: Observable<Item>;
  @Output() locationSelection = new EventEmitter();
  @Output() markerSelection = new EventEmitter();
  @Output() hideFooter = new EventEmitter();
  map: any;
  loading: any;
  locationMarker: any; //Marker for the selected location
  selectedMarker: any; //Marker for the item that has been selected
  locationLayer: any; //Holds the location circles shown to user
  location: any; //The current location of device
  markerLayer: any; //Markers for the items list
  autozoom: number = 15; //Automatic zoom level when selecting markers

  basicMarkerStyle = L.AwesomeMarkers.icon({
    icon: 'star',
    markerColor: 'darkgreen',
    prefix: 'fa'
  });

  selectedMarkerStyle = L.AwesomeMarkers.icon({
    icon: 'star',
    markerColor: 'green',
    prefix: 'fa'
  });

  locationMarkerStyle = L.AwesomeMarkers.icon({
    icon: 'circle',
    markerColor: 'green',
    prefix: 'fa'
  });

  constructor (public loadingCtrl: LoadingController,public toast: ToastService) {}

  //Check that location has been authorized before loading the map
  //Load the map anyways :D
  ngAfterViewInit() {
    this.loading = this.showLoading();
    this.checkRuntimePermissions().then(() => {
      console.log('Location permissions checked')
      setTimeout(this.loadMap.bind(this), 100);
    })
    .catch((error) => {
      console.log('Location permissions error: ' + error);
      setTimeout(this.loadMap.bind(this), 100);
    })
  }

  checkRuntimePermissions() {
    return Diagnostic.getPermissionsAuthorizationStatus([
      Diagnostic.permission.ACCESS_FINE_LOCATION,
      Diagnostic.permission.ACCESS_COARSE_LOCATION
    ])
    .then((permissions) => {
      console.log('ACCESS_FINE_LOCATION: ' + permissions.ACCESS_FINE_LOCATION)
      console.log('ACCESS_COARSE_LOCATION: ' + permissions.ACCESS_COARSE_LOCATION)
      let isGranted =
        permissions.ACCESS_FINE_LOCATION == Diagnostic.permissionStatus.GRANTED &&
        permissions.ACCESS_COARSE_LOCATION == Diagnostic.permissionStatus.GRANTED;

      if(!isGranted) {
        return this.requestRuntimePermissions();
      }
    })
    .catch((error) => {
      console.error('ERROR getting authorization status: ' + error);
    });
  }

  requestRuntimePermissions() {
    return Diagnostic.requestRuntimePermissions([
      Diagnostic.permission.ACCESS_FINE_LOCATION,
      Diagnostic.permission.ACCESS_COARSE_LOCATION
    ])
    .then((permissions) => {
      console.log('ACCESS_FINE_LOCATION: ' + permissions.ACCESS_FINE_LOCATION)
      console.log('ACCESS_COARSE_LOCATION: ' + permissions.ACCESS_COARSE_LOCATION)
      let isGranted =
        permissions.ACCESS_FINE_LOCATION == Diagnostic.permissionStatus.GRANTED &&
        permissions.ACCESS_COARSE_LOCATION == Diagnostic.permissionStatus.GRANTED;

      if(!isGranted) {
        this.toast.showFail('Sovelluksella ei ole lupaa sijaintitietojen käyttöön');
      }
    })
    .catch((error) => {
      console.error('ERROR asking authorization: ' + error);
    })
  }

  /*
  Update markers every time @Inputs change
  Also, center map to selection if @Input:selectedItem has chnages
  (and map is defined)
  */
  ngOnChanges(changes: any) {
    if (changes.selectedItem) {
      this.focusMapToSelectedItem()
    }
    this.updateMarkerLayer();
  }

  //Map needs to be destroyed when logging out, otherwise it'll show up retarded
  //when logging in again
  ngOnDestroy() {
    this.map.remove();
    this.map = null;
    // this.layerTangram = null;
  }

  focusMapToSelectedItem() {
    if (this.selectedItem && this.map) {
      this.selectedItem.subscribe((item) => {
        let zoom = this.map.getZoom() > this.autozoom ? this.map.getZoom() : this.autozoom;
        this.map.setView([item.latLng.lat, item.latLng.lng], zoom);
      }).unsubscribe();
    }
  }

  loadMap() {
    this.map = L
      .map('map', {
        zoomControl: false,
        maxZoom: 18
      })
      .setView([64, 26], 5) //initial view, if location found, sets view to location
      .locate({watch: true, enableHighAccuracy:false, maximumAge:30000})
      .whenReady(this.dismissLoading.bind(this))
      .on('click', this.onMapClick.bind(this))
      .on('contextmenu', this.selectLocation.bind(this))
      // .on('dblclick', this.selectLocation.bind(this))
      // .on('click', this.clearSelection.bind(this))
      .on('locationfound', this.onLocationFound.bind(this))
      .on('locationerror', this.onLocationError.bind(this))
      .on('tileerror', this.onTileError.bind(this));

    // TANGRAM
    // Tangram
    //   .leafletLayer({
    //       scene: {
    //         import: 'https://mapzen.com/carto/walkabout-style-more-labels/walkabout-style-more-labels.yaml',
    //         global: { sdk_mapzen_api_key: 'mapzen-xe5PErc' }
    //       },
    //       // allowCrossDomainWorkers: true
    //       attribution: '© <a href="https://www.mapzen.com/rights">Mapzen</a>, \
    //         <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>, \
    //         and <a href="https://www.mapzen.com/rights/#services-and-data-sources">others</a>'
    //   })
    //   .addTo(this.map);

    //MAPBOX
    L.tileLayer('https://api.mapbox.com/styles/v1/sund4e/ciypy5ilf002i2rplpofrnyfi/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3VuZDRlIiwiYSI6ImNpeXB5NDR6NzAwMDAycXBhaTl6anowMWEifQ.Z8v1RFN4cnjaY6FIykoh-Q', {
      attribution: 'Map & Search data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> ' +
      'contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>, ' +
      'Search © <a href="https://www.mapzen.com/rights">Mapzen</a> ' +
      'and <a href="https://www.mapzen.com/rights/#services-and-data-sources">others</a>.',
      maxZoom: 18,
    }).addTo(this.map);

    L.control.geocoder('mapzen-xe5PErc', {
      markers: false,
      attribution: null
    })
      .addTo(this.map)
      .on('select', this.selectLocation.bind(this))
      .on('focus', () => {this.hideFooter.emit(true)})
      .on('blur', () => {this.hideFooter.emit(false)});


    L.easyButton('fa-crosshairs', this.goToCurrentLocation.bind(this))
    .addTo(this.map);

    L.easyButton({
      id: 'id-for-the-button',
      position: 'topleft',
      // type: 'animate',
      leafletClasses: true,     // use leaflet classes to style the button?
      states:[{
        stateName: 'hide-markers',
        icon: 'fa-star',
        onClick: (control) => {
          if(this.markerLayer) {
            this.markerLayer.remove();
            control.state('show-markers');
          }
        }
      }, {
        stateName: 'show-markers',
        icon: 'fa-star',
        onClick: (control) => {
          this.updateMarkerLayer();
          control.state('hide-markers');
        }
      }]
    }).addTo(this.map);

    this.updateMarkerLayer();
  }

  //if the location layer doesn't exist, set the map's view to the location
  // -> map centered only when location found the first time, after that only
  // draws the circle
  onLocationFound(e) {
    console.log('LOCATION: found in map :)')
    this.location = e.latlng;
    var radius = e.accuracy/2;
    var locationMarker = L.circleMarker(e.latlng, {
      radius: 5,
      fill: true,
      fillOpacity: 0.8
    }).addTo(this.map)

    var accuracyMarker = L.circle(e.latlng, {
      radius: radius,
      weight: 2
    }).addTo(this.map);

    if (this.locationLayer) {
      this.locationLayer.clearLayers();
    } else {
      this.map.setView(this.location, this.autozoom);
    }

    this.locationLayer = L.layerGroup([locationMarker, accuracyMarker])
    .addTo(this.map);
  }

  //Set the view to Finland only if no location ha
  onLocationError(e) {
    this.toast.showFail('Virhe sijaintitiedossa');
    console.log('ERROR LOCATION:')
    console.log('location errorcode: ' + e.code);
    console.log('location errormessage: ' + e.message);
  }

  onTileError(e) {
    this.toast.showFail('Virhe kartan latauksessa');
    console.log(e)
    console.log(e.error)
  }

  goToCurrentLocation () {
    if(this.location) {
      this.map.setView(this.location, this.autozoom);
      this.clearSelection();
    } else {
      this.toast.showFail('Virhe sijaintitiedon haussa');
    }
    // let e = {latlng: this.location}
    // console.log(e);
    // this.selectLocation(e);
  }
  /*
  Saves item key to marker.title as typescript won't allow custom fields on the
  marker. TODO: find a way to get rid of this behaviour :F
  TODO: test that markers are only added if map exists
  TODO: test that removes existing markerLayer
  (we don't want to show old markers when we create the updated layer)
  */
  updateMarkerLayer () {
    if (this.map) {
      if(this.markerLayer) {
        this.markerLayer.remove();
      }
      this.markerLayer = L.markerClusterGroup({
        maxClusterRadius: 30
      });


      _.forEach(this.items, item => {
          let markerStyle = this.basicMarkerStyle

          let marker = L.marker(item.latLng, {
            title: item.$key,
            icon: this.basicMarkerStyle
          }).on('click', this.selectMarker.bind(this));

          if(this.isSelectedItem(item)) {
            this.selectedMarker = marker;
            this.selectedMarker.setIcon(this.selectedMarkerStyle);
          }

          this.markerLayer.addLayer(marker);
        });
      this.map.addLayer(this.markerLayer);
    }
  }

  isSelectedItem(item: Item): boolean {
    if(!this.selectedItem) {
      return;
    }
    let isSame: boolean;
    this.selectedItem.subscribe((selectedItem) => {
        isSame = selectedItem.$key == item.$key;
    }).unsubscribe();
    return isSame;
  }

  /*
  Marker doesn't need to be changed as markerSelection will emit a change to
  map-page.ts which will change @Input:selectedItemId -> ngOnChange will update
  all of the markers
  */
  selectMarker(e) {
    this.clearSelection()
    this.markerSelection.emit(e.target.options.title);
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

  onMapClick(e) {
    if(this.locationMarker || this.selectedMarker) {
      this.clearSelection();
    } else {
      this.selectLocation(e);
    }
  }

  //TODO: test that footer is not hidden (in a case we end up here from search)
  selectLocation(e) {
    this.clearSelection();
    this.locationMarker = new L.Marker(e.latlng, {icon: this.locationMarkerStyle});
    this.locationMarker.addTo(this.map);
    this.locationSelection.emit(e.latlng);
    this.hideFooter.emit(false);
  }

  //TODO: test that always emits selectedLocation false (footer will clear)
  clearSelection() {
    if(this.locationMarker) {
      this.map.removeLayer(this.locationMarker);
      this.locationMarker = undefined;
    };
    if(this.selectedMarker) {
      this.selectedMarker.setIcon(this.basicMarkerStyle);
      this.selectedMarker = undefined;
    }
    this.locationSelection.emit(false);
  }

  //TODO:alert user
  // handleLocationError(e) {
  //   this.map.setView([64, 26], 5);
  //   console.log('Location error in leaflet map:')
  //   console.log(e.message);
  // }
}
