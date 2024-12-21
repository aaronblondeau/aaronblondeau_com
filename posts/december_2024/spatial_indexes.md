---
layout: blog_post.njk
tags: ['post', 'technology', 'spatial']
title: Geospatial Indexing Sampler
teaser: Geohash, H3, and S2
date: 2024-12-20
cover: /assets/images/spatial_indexing.jpg
---

I recently did an exercise in trying to build an app while pretending to be a minimalist. This required that I be able to filter gps points without using my tried and true friend [PostGIS](https://postgis.net/).

I took a quick tour of the three most popular ways to index spatial data : [Geohash](https://www.npmjs.com/package/ngeohash), [H3](https://h3geo.org/), and [S2](http://s2geometry.io/).

All 3 of these tools work by slicing up the globe into shapes that sub-divide into smaller and smaller units as you zoom in.

- GeoHash uses rectangles 
- H3 uses hexagons
- S2 is wild and uses a space filling curve

A great way to explore how these types of indexes work is at [https://geohash.softeng.co/](https://geohash.softeng.co/). As you click each cell it will zoom in and show you a deeper level. One of my favorite places in the world is in GeoHash [ddk6p5](https://geohash.softeng.co/ddk6p5)

Using these to "index" GPS data is as simple as adding a text column for each level you're interested in. For example, I could create a table like this:

```
CREATE TABLE IF NOT EXISTS places (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    latitude REAL,
    longitude REAL,
    geohash_level_2 TEXT,
    geohash_level_4 TEXT
);

INSERT INTO places (name,latitude,longitude,geohash_level_2,geohash_level_4)
VALUES('mt shavano', 38.618840, -106.239364, '9w', '9wu7');

INSERT INTO places (name,latitude,longitude,geohash_level_2,geohash_level_4)
VALUES('blanca peak', 37.578047, -105.485796, '9w', '9wsv');

INSERT INTO places (name,latitude,longitude,geohash_level_2,geohash_level_4)
VALUES('mt princeton', 38.749148, -106.242578, '9w', '9wuk');

INSERT INTO places (name,latitude,longitude,geohash_level_2,geohash_level_4)
VALUES('la soufriere', 13.336299, -61.177146, 'dd', 'ddk7');
```

[Sqlime](https://sqlime.org/) is a good place to try these queries out.

Then to find places in southern Colorado, I would find which hash covers that part of the map which is '9w':

```
SELECT * FROM places WHERE geohash_level_2 = '9w';
```

To find places in the southern Caribbean I could use:

```
SELECT * FROM places WHERE geohash_level_2 = 'dd';
```

This approach does require some planning up front on which levels of index you need to keep in your database.  Otherwise it works great for simple applications where you need to quickly find which objects are found in a specific area or map viewport.

Having a database that supports LIKE queries can help cut down on having to use multiple columns. Also note that H3 cell numbers don't perfectly overlap so "starts with" type queries won't work with H3.

Finally, a neat feature of these indexes is that the cell numbers would make great realtime event topics.  So, in my examples above, I could create an event topic called '9w' for southern colorado. Then as new places are added I would emit an event in the '9w' topic for each new place.

Here is some sample JavaScript (deno) code for each of these index types:

Note that GeoJSON output can be viewed here : [https://geojson.io/](https://geojson.io/)

## GeoHash

```JavaScript
import { geocoordinateToGeohash } from 'npm:geocoordinate-to-geohash'
import { geohashToPolygonFeature } from 'npm:geohash-to-geojson'

import geohash from 'npm:ngeohash'
const lat = 38.618840
const lng = -106.239364
const hash2 = geohash.encode(lat, lng, 2)
console.log('mt shavano hash at level 2', hash2)
const feat2 = geohashToPolygonFeature(hash2)
console.log('mt shavano hash at level 2 bounds', JSON.stringify(feat2))

// About a city block in size in CO (size changes as you head towards poles)
const hash7 = geohash.encode(lat, lng, 7)
console.log('mt shavano hash at level 4', hash7)
const feat7 = geohashToPolygonFeature(hash7)
console.log('mt shavano hash at level 4 bounds', JSON.stringify(feat7))
```

## H3

```JavaScript
import h3 from 'npm:h3-js'
import geojson2h3 from "npm:geojson2h3"

const lat = 38.618840
const lng = -106.239364

// Level 2 (~1/3 Colorado Size)
const h3IndexL2 = h3.latLngToCell(lat, lng, 2);
console.log('mt shavano cell at level 2', h3IndexL2)
const featureL2 = geojson2h3.h3ToFeature(h3IndexL2)
console.log('mt shavano cell at level 2 bounds', JSON.stringify(featureL2))

// Level 4 (~City of Salida Size)
const h3IndexL4 = h3.latLngToCell(lat, lng, 4);
console.log('mt shavano cell at level 4', h3IndexL4)
const featureL4 = geojson2h3.h3ToFeature(h3IndexL4)
console.log('mt shavano cell at level 4 bounds', JSON.stringify(featureL4))
```

## S2

```JavaScript
// This might be a better choice : https://www.npmjs.com/package/@radarlabs/s2
import s2 from 'npm:s2-geometry'
const S2 = s2.S2
const lat = 38.618840
const lng = -106.239364

const key2 = S2.latLngToKey(lat, lng, 2)
const id2 = S2.keyToId(key2)
const feature2 = cellCornersToFeatureCollection(lat, lng, 2)
console.log('mt shavano key at level 2', key2)
console.log('mt shavano cell id at level 2', id2)
console.log('mt shavano cell at level 2 corners', JSON.stringify(feature2))

const key4 = S2.latLngToKey(lat, lng, 4)
const id4 = S2.keyToId(key4)
const feature4 = cellCornersToFeatureCollection(lat, lng, 4)
console.log('mt shavano key at level 4', key4)
console.log('mt shavano cell id at level 4', id4)
console.log('mt shavano cell at level 4 corners', JSON.stringify(feature4))

function cellCornersToFeatureCollection(lat, lng, level) {

    const ll = S2.L.LatLng(lat, lng)
    const cell = S2.S2Cell.FromLatLng(ll, level)
    const corners = cell.getCornerLatLngs()
    const coordinates = corners.map((pair) => {
        return [pair.lng, pair.lat]
    })

    return {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [coordinates]
            },
            "properties": {}
          }
        ]
      }
}
```
