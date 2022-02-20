---
layout: blog_post.njk
tags: ['post', 'technology', 'javascript', 'hasura']
title: Use Hasura, impress your friends.
teaser: In exchange for setting up tables in your database, Hasura will gift you a fast and secure API that just works.
cover: /assets/images/hasura.webp
date: 2022-02-19
---

I used [Hasura](https://hasura.io/) to build the backend for [TerraQuest](https://terraquest.com/).  There was simply no other way to create a full featured API in the amount of time I had available.  At the time I was worried that I would pay some sort of a price for the exceptionally fast development turnaround that Hasura offered.

Whenever I try to use a backend offering like Hasura I usually find a showstopper pretty quickly.  From expensive pricing, to vendor lock-in, to a lack of support for spatial queries, they draw you in and then quickly disappoint.  

Hasura has proven to be quite the opposite:
- You can host it yourself or in the cloud.
- If Hasura goes bust or GraphQL ever goes out of style you'll have a well organized database that you can wrap up with something else.
- You have the full power of PostGRES (and PostGIS) with no limitations.
- In exchange for setting up tables in your database, Hasura will gift you a fast and secure API that just works.
- It is easy to extend with [events](https://hasura.io/docs/latest/graphql/core/event-triggers/index.html), [custom actions](https://hasura.io/docs/latest/graphql/core/actions/index.html), or even [other apis](https://hasura.io/docs/latest/graphql/core/remote-schemas/index.html).

Since I will certainly be using Hasura again, I am working on building out some starter projects for Node and .NET.  The Node.js version is coming together and can be found [here](https://github.com/aaronblondeau/node_starters/tree/master/node).
