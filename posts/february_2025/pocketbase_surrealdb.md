---
layout: blog_post.njk
tags: ['post', 'technology', 'surrealdb', 'pocketbase']
title: PocketBase + SurrealDB
teaser: How to extend PocketBase with SurrealDB
date: 2025-02-14
cover: /assets/images/pocketbase_surreal.png
---

[PocketBase](https://pocketbase.io/) is shockingly well engineered.

PocketBase is an open source backend that provides:
- Authentication (including social auth)
- Database (SQLite, with realtime support)
- File storage (local or S3)
- Dart and Javascript SDKs for above

What makes it so well engineered is how [extensible and flexible](https://pocketbase.io/docs/go-overview/) it is. It also packs a punch for being so simple and lightweight.

It does have one core limitation in that it uses SQLite as it's storage engine. This means two things
1) Scaling can only happen vertically.
2) Support for Geo-spatial and vector data types are not available.

I think that (Turso)[https://turso.tech/] and PocketBase could become good friends. [There already is some support for this.](https://pocketbase.io/docs/go-overview/#github-comtursodatabaselibsql-client-golibsql)

PocketBase's solid design and extensibility also makes it easy to integrate with other backends to access features beyond SQLite. Here is an example scenario. Let's say you're building an app like [x-skies](https://x-skies.com/) where users can report UFO sightings. Each sighting will have a description as well as a latitude and longitude. You'd like to use [SurrealDB's spatial support](https://surrealdb.com/docs/surrealdb/models/geospatial) to manage the location data and PocketBase for everything else. The data flow would look like this:

![Data Schema: description and id of record stored in PocketBase, latitude and longitude of record stored in SurrealDB](/assets/images/pocketbase_surreal_diagram.png)

Due to PocketBase's excellent set of hooks this is very easy to do! An example with all the code can be found here : [https://github.com/aaronblondeau/surreal_pocket](https://github.com/aaronblondeau/surreal_pocket).

**Step 1** is to use PocketBase's OnRecordCreateRequest hook to watch each incoming sighting : [https://github.com/aaronblondeau/surreal_pocket/blob/main/main.go#L139](https://github.com/aaronblondeau/surreal_pocket/blob/main/main.go#L139).

In this hook I grab that latitude and longitude that were sent by the frontend and make sure they are stored in the new record's custom data. Since I am not storing the latitude and longitude at all in PocketBase this step ensures those fields don't get lost.

**Step 2** is to use PocketBase's OnRecordCreateExecute hook to save the location data in SurrealDB : [https://github.com/aaronblondeau/surreal_pocket/blob/main/main.go#L161](https://github.com/aaronblondeau/surreal_pocket/blob/main/main.go#L161)

I chose this hook because at this point PocketBase has already assigned an id to the record but not yet saved it. This means I can use the id to save the location data in SurrealDB. If there is an error when saving to Surreal it will also prevent the save from happening in PocketBase to help things stay in sync.

**Step 3** is to use the OnRecordEnrich hook to re-attach the latitude and longitude as each record is returned from the server : [https://github.com/aaronblondeau/surreal_pocket/blob/main/main.go#L180](https://github.com/aaronblondeau/surreal_pocket/blob/main/main.go#L180)

OnRecordEnrich is where the PocketBase crew deserves a high five for their design work because it so incredibly useful. In this callback I simply lookup the matching record in SurrealDB and attach the latitude and longitude before it goes out the door. There was a slight trick to this though:

```
e.Record.WithCustomData(true)
```

This WithCustomData call lets me attach my own virtual fields to the records so that they seem like ordinary database fields in the frontend code.

**Step 4** is to use the OnRecordAfterDeleteSuccess hook to make sure things stay in sync when records are deleted in PocketBase. You'd want a similar rig for updates as well. [https://github.com/aaronblondeau/surreal_pocket/blob/main/main.go#L204](https://github.com/aaronblondeau/surreal_pocket/blob/main/main.go#L204)

**Finally** add a custom route that performs spatial searches in SurrealDB and merges the results with the PocketBase data : [https://github.com/aaronblondeau/surreal_pocket/blob/main/main.go#L84](https://github.com/aaronblondeau/surreal_pocket/blob/main/main.go#L84)

And now you've got a really clean way to add spatial support to PocketBase!

Note that I purposefully made this harder than it had to be to test the extensibility of PocketBase. The latitude and longitude could be stored in PocketBase as well as SurrealDB with Surreal only providing the spatial indexing. However, I thought it would be neat to see if I could make those fields fully virtual.

Don't let PocketBase's simplicity prevent you from trying it out. Adding vector support, full text search, and all kinds of other features are possible with similar techniques.


