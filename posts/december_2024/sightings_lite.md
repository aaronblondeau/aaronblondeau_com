---
# layout: blog_post.njk
# tags: ['post', 'technology', 'deno', 'spatial']
# title: Sightings
# teaser: A minimalist approach to building ideas.
# date: 2024-12-21
# cover: /assets/images/spatial_indexing.jpg
---

Wouldn't it be cool if there was an app that allows users to report drone sightings and also display a realtime feed of those sightings on map.

## Step 1 : Problem Breakdown

Whenever I get an idea for a new project I immediately think of all the fun stuff that I'll get to build into the project. User authentication, file storage, content delivery network, email notifications, analytics, amazing user interface, AI, and the list goes on. After many years of wasting my limited hours here on earth over-engineering things I realize that I need to turn those thoughts off and minimize the problem instead.

Does it need user authentication? No.
File storage? No.
A CDN? No.
Email notifications? No.
Analytics? No.
Amazing user interface? No.
AI? What is wrong with you?

What do I actually need for a drone sighting realtime map then?

1) A map that shows markers for drone sightings
2) A button that says "I saw a drone!"
3) A data storage service of some kind that supports realtime feeds and can store gps locations

## Step 2 : Tech Stack Decision

I like to design my tech stacks from the bottom up, starting with data storage. My first thought is that we're going to have to use PosgGres + PostGIS for this one. I also like to worry about scalability. So, definitely gotta go with PostGres.

See that? I just over-engineered again!

Fine. What about SQLite?

Next layer up. What about the realtime data feed?

PocketBase

What about the UI?

VueJS and MapLibre

Ok Mr. Minimalism. What if you do get a bunch of users and drone sighting reports? You'll be crashing people's browsers and poor little PocketBase will grind to a halt. If only someone had just written a blog post about GeoSpatial indexing tools that can work in SQLite...

GeoHash

## Step 3 : Implementation

Critical path = gps locations + realtime



## Step 4 : Testing


## Step 5 : Deployment
 
docker-compose + Caddy
Dockerfile + Caprover
