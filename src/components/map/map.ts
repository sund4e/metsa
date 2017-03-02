import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Http} from '@angular/http';
import {LoadingController} from 'ionic-angular';
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
  map: any;
  loading: any;
  locationMarker: any; //Marker for the selected location
  selectedMarker: any; //Marker for the item that has been selected
  // selectedItemId: string;
  markerLayer: any; //Markers for the items list
  autozoom: number = 16; //Automatic zoom level when selecting markers

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

  constructor (public loadingCtrl: LoadingController) {}

  ngAfterViewInit() {
    this.loading = this.showLoading();
    //load map doesn't fire without timeout TODO: any other workaroud?
    setTimeout(this.loadMap.bind(this), 100);
  }

  /*
  Update markers every time @Inputs change
  Update this.selectedItem when @Input:selectedItem changes so that selected
  item is rendered differently when updating the markers. Also, center map to
  selection (if map is defined)
  */
  ngOnChanges(changes: any) {
    console.log('changes in map.ts @Input');
    console.log(changes);
    if (changes.selectedItem) {
      this.focusMapToSelectedItem()
    }
    this.updateMarkerLayer();
  }

  focusMapToSelectedItem() {
    if (this.selectedItem && this.map) {
      this.selectedItem.subscribe((item) => {
        let zoom = this.map.getZoom() > this.autozoom ? this.map.getZoom() : this.autozoom;
        console.log(zoom);
        this.map.setView([item.latLng.lat, item.latLng.lng], zoom);
      }).unsubscribe();
    }
  }

  loadMap() {
    console.log('loadMap:');
    this.map = L
      .map('map', {
        zoomControl: false,
        maxZoom: 20
      })
      .locate({setView: true, maxZoom: this.autozoom})
      .whenReady(this.dismissLoading.bind(this))
      .on('contextmenu', this.selectLocation.bind(this))
      .on('click', this.clearSelection.bind(this))
      .on('locationfound', () => {console.log(event)})
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
      icon: 'fa fa-location-arrow',
      locateOptions: {watch: true},
      onLocationError: (e) => {
        console.log('Location error in leaflet locate control:');
        console.log(e);
      }
      // icon: 'fa fa-compass'
    }).addTo(this.map);

    L.easyButton({
      id: 'id-for-the-button',
      position: 'topleft',
      // type: 'animate',
      leafletClasses: true,     // use leaflet classes to style the button?
      states:[{
        stateName: 'hide-markers',
        icon: 'fa-map-marker',
        onClick: (control) => {
          if(this.markerLayer) {
            console.log('remove markers')
            this.markerLayer.remove();
            control.state('show-markers');
          }
        }
      }, {
        stateName: 'show-markers',
        icon: 'fa-map-marker',
        onClick: (control) => {
          console.log('show markers')
          this.updateMarkerLayer();
          control.state('hide-markers');
        }
      }]
    }).addTo(this.map);
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
      console.log('marker layer updated')
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
    console.log('selectMarker: marker selected');
    // this.selectedMarker = e.target;
    // this.selectedMarker.setIcon(this.selectedMarkerStyle);
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

  selectLocation(e) {
    this.clearSelection();
    this.locationMarker = new L.Marker(e.latlng, {icon: this.locationMarkerStyle});
    this.locationMarker.addTo(this.map);
    this.locationSelection.emit(e.latlng);
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
  handleLocationError(e) {
    this.map.setView([64, 26], 5);
    console.log('Location error in leaflet map:')
    console.log(e.message);
  }
}
