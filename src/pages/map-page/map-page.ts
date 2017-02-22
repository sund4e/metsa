import { Component, ViewChild } from '@angular/core';
import { NavController, Content, ModalController } from 'ionic-angular';
import {style, state, animate, transition, trigger} from '@angular/core';
import { FirebaseListObservable} from 'angularfire2';
import {AddLocationPage} from '../add-location/add-location';
import { ListPage } from '../list/list';
import { SettingsPage } from '../settings/settings';
import {ItemsService} from '../../providers/items-service'

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
  showFooter: boolean = false;
  latLng: Array<number>;
  itemList: FirebaseListObservable<any>;
  item: any;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public itemService: ItemsService
  ) {
    this.itemList = itemService.getItems();
  }

  //when changing the tab the footer is kept the way it is but the map is not
  //loaded to full view if the footer is up
  ionViewDidLoad() {
    this.showFooter = false;
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

  showItemBar(id) {
    console.log('showitembar');
    console.log(id);
    this.item = this.itemService.getItem(id);
    console.log(this.item);
    // this.item.subscribe(item => {
    //   console.log('jee:');
    //   console.log(item)
    // })
  }

  openAddLocationModal() {
    let modal = this.modalCtrl.create(AddLocationPage, { latLng: this.latLng });
    modal.onDidDismiss(data => {
     this.showAddLocationBar(undefined);
   });
    modal.present();
  }

  openListModal() {
    let modal = this.modalCtrl.create(ListPage);
    modal.onDidDismiss(data => {
      console.log(data);
    });
    modal.present();
  }

  openSettingsModal() {
    let modal = this.modalCtrl.create(SettingsPage);
    modal.onDidDismiss(data => {
      console.log(data);
    });
    modal.present();
  }

}
