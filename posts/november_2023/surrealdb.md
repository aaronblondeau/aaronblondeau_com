---
layout: blog_post.njk
tags: ['post', 'technology', 'surrealdb', 'python']
title: SurrealDB + Python
teaser: Kicking the tires on SurrealDB
cover: /assets/images/surrealdb.jpg
date: 2023-11-01
---

I've had my eye on [SurrealDB](https://surrealdb.com/) for quite some time and finally got a chance to try it out. I did try some experiments with it a few months ago, but their documentation was so sparse I couldn't get it to go. Things are much better now and I feel like SurrealDB lives up to the hype.

I was especially interested to see how much of an application backend SurrealDB could cover.

| Capability  | SurrealDB |
| ----------- | ----------- |
| User Authentication | Yep, via JWT tokens too! |
| Permissions | I used table PERMISSIONS - worked great and should allow for complex scenarios. |
| Multi-tenant data | Yes via permissions. (Surreal also has namespaces) |
| File storage | Ha - not really unless you store as string encoded data. |
| Background tasks | [Events](https://surrealdb.com/docs/surrealql/statements/define/event) + [http functions](https://surrealdb.com/docs/surrealql/functions/http) could really help here to coordinate things like email delivery. |

See my detailed Jupyter Notebook here : [https://gist.github.com/aaronblondeau/deb7354105ed6a2daa07e49502324e5e](https://gist.github.com/aaronblondeau/deb7354105ed6a2daa07e49502324e5e)

Things that I liked
- The user auth model works great.
- The query language is very intuitive. I especially liked the graph relationship query syntax.
- LET statement is super handy.
- The 3rd party [Surrealist](https://surrealist.app/) UI now works like a charm.
- Being able to create tables (and relationships) on the fly is very handy for prototyping work.
- Vectors (for embeddings) are built in.
- Built in support for GeoJSON - sweet!

Things that I didn't like
- No errors. A lot of things I tried just returned empty data. Maybe this is just the Python SDK, but it made it really hard to troubleshoot queries.
- No graph search. I am working on a specific use case that requires graph route searching abilities and these don't appear to be available yet.
- Events can be a bit hard to reason about as they occur after the update and data in the event payload may no longer exist.  Maybe I should've been using functions instead.
- No CASCADE delete (but I did accomplish what I wanted with events)
