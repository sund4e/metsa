/*
  Declaration files are how the Typescript compiler knows about the type information(or shape) of an object.
  They're what make intellisense work and make Typescript know all about your code.

  A wildcard module is declared below to allow third party libraries to be used in an app even if they don't
  provide their own type declarations.

  To learn more about using third party libraries in an Ionic app, check out the docs here:
  http://ionicframework.com/docs/v2/resources/third-party-libs/

  For more info on type definition files, check out the Typescript docs here:
  https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html
*/
declare module '*';
declare module 'mapzen.js';

/*
Typings for leaflet.locatecontrol & leaflet-easybutton by Suvi

Typings for leaflet-geocoder-mapzen edited from:
https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/leaflet-geocoder-mapzen/index.d.ts
(some errors in the original typings)
*/
//// <reference path="../node_modules/@types/leaflet/index.d.ts" />
/// <reference path="../typings/globals/leaflet/leaflet.d.ts" />
declare namespace L {
  export interface ControlStatic {
    Locate: Control.LocateStatic;
  }

  namespace Control {
    export interface LocateStatic {
      new(options?: LocateOptions): Locate;
    }

    export interface Locate extends L.Control {
      start(): this,
      stop(): this
    }

    export interface GeocoderStatic {
      new (options?: GeocoderOptions): Geocoder;
    }

    export interface Geocoder extends L.Evented, L.Control {
    }

    export interface GeocoderOptions {
      url?: string;
      bounds?: LatLngBounds | boolean;
      focus?: LatLng | boolean;
      layers?: string | any[] ;
      params?: Object;
      position?: any;
      attribution?: string;
      placeholder?: string;
      title?: string;
      panToPoint?: boolean;
      polygonIcon?: boolean | string;
      markers?: MarkerOptions | boolean;
      fullWidth?: number | boolean;
      expanded?: boolean;
      autocomplete?: boolean;
      place?: boolean;
    }

    export interface EasyButtonStatic {
      new (options?: EasyButtonOptions): EasyButton;
    }

    export interface EasyButton extends L.Control {
    }

    export interface EasyButtonOptions {

    }
  }

  //https://github.com/domoritz/leaflet-locatecontrol
  export interface LocateOptions {
    position?: string;
    layer?: Layer;
    setView?: boolean;
    flyTo?: boolean;
    keepCurrentZoomLevel?: boolean;
    clickBehavior?: any;
    returnToPrevBounds?: boolean;
    cacheLocation?: boolean;
    drawCircle?: boolean;
    drawMarker?: boolean;
    markerClass?: any;
    circleStyle?: Path;
    markerStyle?: Path;
    followCircleStyle?: Path;
    followMarkerStyle?: Path;
    icon?: string;
    iconLoading?: string;
    iconElementTag?: string;
    circlePadding?: Array<number>;
    onLocationError?: Function;
    onLocationOutsideMapBounds?: Function;
    showPopup?: boolean;
    strings?: any;
    locateOptions?: any;
  }

  export namespace control {
    export function locate(options?: LocateOptions): L.Control.Locate;
  }

  export namespace control {
    export function geocoder(api_key: string, options?: Control.GeocoderOptions): L.Control.Geocoder;
  }

  export function easyButton(button: any, options?: Control.EasyButtonOptions): L.Control.EasyButton;
}
