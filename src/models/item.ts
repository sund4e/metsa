import * as moment from 'moment';

export class Item {

  constructor(
    public latLng: number[],
    public species: string,
    public notes: string,
    public rating: number,
    public timestamp: Date
  ){}

  // static fromJsonList(array:any): Item[] {
  //   return array.map(Item.fromJson);
  // }

  // static fromJson({repliers, $key }:any): Item {
  //   return new Item(repliers, $key );
  // }

}
