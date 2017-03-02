## Synopsis

At the top of the file there should be a short introduction and/ or overview that explains **what** the project is. This description should match descriptions added for package managers (Gemspec, package.json, etc.)


## Installation
In order to work on IOS:

’’’
ionic plugin add cordova-plugin-geolocation
’’’

Install leaflet plugins

´´´
npm install leaflet.markercluster
install dt~leaflet-markercluster --global --save

npm install drmonty-leaflet-awesome-markers --save
typings install dt~leaflet.awesome-markers --save --global
´´´
leaflet typings break leaflet.awesome-markers typings -> in leaflet typings
change line 1417 ´iconUrl: string;´  to ´iconUrl?: string;´

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

##Todo
-! make sure map control buttons work (test native)
-! sing out and sign in -> retarded map (test native)
-! orientation (test native)
-! handle location errors in map-page.js
- show apologises to the user if tangram is not working
- anonymous account
- mapping firebase errors in Finnish
- adding possibility to convert anonymous account to user account
- images
- analytics : http://blog.pdsullivan.com/posts/2015/02/19/ionicframework-googleanalytics-log-errors.html
- geofire
- tests
- refactor mappage & map.ts
