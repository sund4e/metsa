import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {AutoCompleteService} from 'ionic2-auto-complete';
import _ from 'lodash';
/*
Example of API function: https://github.com/kadoshms/ionic2-autocomplete
*/
@Injectable()
export class SpeciesService implements AutoCompleteService {
  labelAttribute = 'name'; //Needed for AutoCompleteService
  items: any;

  constructor(public http: Http) {
    this.initializeItems();
  }

  initializeItems() {
    this.items = [
      {name:"Akansieni"},
      {name:"Haaparousku"},
      {name:"Haavanpunikkitatti"},
      {name:"Haisuhapero"},
      {name:"Harmaarousku"},
      {name:"Herkkutatti"},
      {name:"Isohapero"},
      {name:"Jauhosieni"},
      {name:"Jyvästatti"},
      {name:"Kangashapero"},
      {name:"Kangaspalsamirousku"},
      {name:"Kangasrousku"},
      {name:"Kangastatti"},
      {name:"Kartiohuhtasieni"},
      {name:"Karvarousku"},
      {name:"Kehnäsieni"},
      {name:"Keltahaarakas"},
      {name:"Keltahapero"},
      {name:"Keltarousku"},
      {name:"Keltasarvikka"},
      {name:"Keltavahvero (Kanttarelli)"},
      {name:"Koivuhapero"},
      {name:"Koivunkantosieni"},
      {name:"Koivunlehtohapero"},
      {name:"Koivunpunikkitatti"},
      {name:"Korvasieni"},
      {name:"Kosteikkovahvero"},
      {name:"Kultarousku"},
      {name:"Kuusenleppärousku"},
      {name:"Kuusensuomuorakas"},
      {name:"Kuusiherkkusieni"},
      {name:"Kuusilahokka"},
      {name:"Känsätuhkelo"},
      {name:"Lampaankääpä"},
      {name:"Lehmäntatti"},
      {name:"Lehtikuusentatti"},
      {name:"Lehtopunikkitatti"},
      {name:"Limanuljaska"},
      {name:"Monivyöseitikki"},
      {name:"Munahapero"},
      {name:"Mustatorvisieni"},
      {name:"Männynherkkutatti"},
      {name:"Männynleppärousku"},
      {name:"Männynpunikkitatti"},
      {name:"Männynsuomuorakas"},
      {name:"Nokirousku"},
      {name:"Nokitatti"},
      {name:"Nuijakuukunen"},
      {name:"Nummitatti"},
      {name:"Nurmimaamuna"},
      {name:"Nurmirousku"},
      {name:"Oranssirousku"},
      {name:"Palterohapero"},
      {name:"Peltoherkkusieni"},
      {name:"Pikkurousku"},
      {name:"Punavyöseitikki"},
      {name:"Rusakkonuljaska"},
      {name:"Rusko-orakas"},
      {name:"Ruskokärpässieni"},
      {name:"Ruskotatti"},
      {name:"Ryhmätuhkelo"},
      {name:"Samettitatti"},
      {name:"Savuhapero"},
      {name:"Savurousku"},
      {name:"Sikurirousku"},
      {name:"Sillihapero"},
      {name:"Suomumustesieni"},
      {name:"Suppilovahvero"},
      {name:"Talvijuurekas"},
      {name:"Tammenherkkutatti"},
      {name:"Tammenrousku"},
      {name:"Tapionherkkusieni"},
      {name:"Typäskääpä"},
      {name:"Ukonsieni"},
      {name:"Vaaleaorakas"},
      {name:"Valkolehmäntatti"},
      {name:"Vesikehärousku"},
      {name:"Viinihapero"},
      {name:"Viitapalsamirousku"},
      {name:"Voitatti"},
      {name:"Äikätatti"},
      {name:"Ahomansikka"},
      {name:"Lakka"},
      {name:"Mesimarja"},
      {name:"Mustikka"},
      {name:"Juolukka"},
      {name:"Vadelma"},
      {name:"Lillukka"},
      {name:"Variksenmarja"},
      {name:"Punaherukka"},
      {name:"Mustaherukka"},
      {name:"Karviainen"},
      {name:"Riekonmarja"},
      {name:"Puolukka"},
      {name:"Pihlajanmarja"},
      {name:"Karpalo"},
      {name:"Tyrni"}
    ]
  }

  getResults(keyword:string) {
    let results = this.items.filter((item) => {
      let itemName: any = _.get(item, this.labelAttribute)
      return (itemName.toLowerCase().indexOf(keyword.toLowerCase()) > -1);
    })
    return results;
  }

  getSpeciesList() {
    return _.map(this.items, 'name');
  }

}
