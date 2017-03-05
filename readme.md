## Synopsis

At the top of the file there should be a short introduction and/ or overview that explains **what** the project is. This description should match descriptions added for package managers (Gemspec, package.json, etc.)


## Installation
In order to work on IOS:

’’’
ionic plugin add cordova-plugin-geolocation
’’’

Install leaflet plugins

```
npm install leaflet.markercluster
install dt~leaflet-markercluster --global --save

npm install drmonty-leaflet-awesome-markers --save
typings install dt~leaflet.awesome-markers --save --global
```
leaflet typings break leaflet.awesome-markers typings -> in leaflet typings
change line 1417 `iconUrl: string;`  to `iconUrl?: string;`

Add Android:

```
cordova platform add android --save
ionic build android
```

Geolocation not working on android: Add these to AndroidManifes.xml:
```
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.NETWORK_ACCESS" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_LOCATION_EXTRA_COMMANDS" />
```

##Typings issue
Make sure that ´tsconfig.json´has

´´´
"include": [
  "typings/index.d.ts"
]
´´´

##others
Lodash typings 4.14.52 are invalid: manually install the pervious verion

´´´
typings remove
npm install @types/lodash@4.14.44 --save
´´´


## Tests

Describe and show how to run the tests with code examples.

##Todos
- itemlist marigin
<!-- -! Mapbox! -->
<!-- -! Change logic for near you list -->
<!-- -! Mark your location as apaja -->
<!-- -! double click as well as long tap to mark -->
<!-- -! dismiss apaja if location search is opened -->
<!-- -! Own Splashcreen -->

- alasvetolista epäselvä

Kehitysidikset:
- reitit apajille
- mahdollisuus jakaa tietyille käyttäjille
- päivitysmahdollisuus (kommentit apajille)
- Notes ei rivity nätisti


- show apologises to the user if tangram is not working
- splashscreen
- anonymous account
- mapping firebase errors in Finnish
- adding possibility to convert anonymous account to user account
- images
- analytics : http://blog.pdsullivan.com/posts/2015/02/19/ionicframework-googleanalytics-log-errors.html
- geofire
- tests
- refactor mappage & map.ts
