import * as moment from 'moment';

export class Item {
  $key: string;
  distance: number; //used to save the distance from current location in km

  constructor(
    public latLng: [number, number] | any,
    public species: string,
    public notes: string,
    public rating: number,
    public timestamp: number
  ){}

  static fromJsonList(array:any): Item[] {
    return array.map(Item.fromJson);
  }

  static fromJson({$key, latLng, species, notes, rating, timestamp }:any): Item {
    let item = new Item(latLng, species, notes, rating, timestamp);
    item.setKey($key);
    return item;
  }

  private setKey(key) {
    this.$key = key;
  }

}
