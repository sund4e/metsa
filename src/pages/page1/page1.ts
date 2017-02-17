import { Component, ViewChild } from '@angular/core';
import { NavController, Content, ModalController } from 'ionic-angular';
import {style, state, animate, transition, trigger} from '@angular/core';
import {AddLocationPage} from '../add-location/add-location';
// import {MapComponent} from '../../components/map/map'
// import * as mapz from 'mapzen.js'
// import * as L from 'leaflet'

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({transform: 'translateY(100%)'}),
        animate(200)
        // style({opacity:0}),
        // animate(500, style({opacity:1}))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(200, style({transform: 'translateY(100%)'}))
        // animate(500, style({opacity:0}))
      ])
    ])
  ]
})
export class Page1 {
  // @ViewChild(Content) content: Content;
  showFooter: boolean = false;
  latLng: Array<number>

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {
  }

  showAddLocationBar(latLng) {
    if(latLng) {
      this.latLng = latLng;
      this.showFooter = true;
    } else {
      this.latLng = undefined;
      this.showFooter = false
    }
  }

  openAddLocationModal() {
    console.log('click')
    let modal = this.modalCtrl.create(AddLocationPage, { latLng: this.latLng });
    modal.present();
  }

}
