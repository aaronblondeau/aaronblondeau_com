---
layout: blog_post.njk
tags: ['post', 'technology', 'orleans', 'dapr']
title: Virtual Actors - Dapr vs Orleans
teaser: A trip way out into the woods of software development.
cover: /assets/images/orleans_vs_dapr.jpg
date: 2022-06-28
---

This past week I took a trip way out into the woods of software development by studying the idea of virtual actors.  I wound up studying two different frameworks : [Dapr](https://dapr.io/) and [Orleans](https://docs.microsoft.com/en-us/dotnet/orleans/).

Both are very neat projects with a ton of interesting use cases.  Both use the idea of "virtual" actors.  A virtual actor is a unit of state and logic that:
- can be uniquely identified by id
- is single threaded
- can be in memory or persisted - its lifetime is managed by the framework

I really like the idea of virtual actors and feel that they would be very helpful in my quest to build a scalable and reliable tool for processing complex task workflows.  If each task is a single threaded virtual actor then race condition problems simply go away.

Because both Orleans and Dapr are Microsoft projects I envision a west side story style showdown in the Microsoft cafeteria someday.

## Orleans

I started with Orleans because it had been on my radar for a while after I saw some videos about it on YouTube.  It got off to a really bad start because I figured I'd use the 4.x version of all their NuGet packages. However, absolutely none of their documentation worked with the 4.x packages. I wound up working with the 3.6.2 version instead.

### Grains / State / Timers

Creating a grain that keeps track of its own state and performs actions was fairly straightforward.  I was even able to follow the documentation for grain persistence and created my own CosmosDB (SQL API) implementation of IGrainStorage. 

### Reminders

Reminders were also very easy to setup.  Until I tried to configure real world persistence for them that is.  At this point in my research I was trying to keep things neat and tidy and store everything in ComsosDB. Unfortunately, I could not get the [reminder persistence package](https://github.com/OrleansContrib/Orleans.CosmosDB) for Orleans to work at all. I wound up having to use the [AzureStorage](https://www.nuget.org/packages/Microsoft.Orleans.Reminders.AzureStorage/) package instead.  So now my data was half in a SQL API account and half in a Table API account.

### Streams

This is where things did not go well for me. In Orleans, streams are identified with a GUID and an optional namespace.  I'm sure there is a strong reason that streams have to be identified by a GUID, but wow is that ever impractical.

I became very frustrated with streams because I was able to easily create them, but once I stopped and restarted my project and triggered a new event everything would blow up.  

Next is an extremely valuable piece of information because it took me literally 8 hours of reverse engineering the Orleans code to figure out:

_When a grain is a stream subscriber, that grain must call ResumeAsync on the subscription handle in its OnActivateAsync method or else you will get crashes with indeciperable errors._

```C#
public override async Task OnActivateAsync()
{
    // For some reason we have to re-subscribe to streams here.
    // Otherwise we get Null pointer errors
    // or grain extension not installed errors
    // depending on combo of storage providers used
    var streamProvider = GetStreamProvider("SMSProvider");
    var stream = streamProvider.GetStream<int>(Guid.Parse("0f8fad5b-d9cb-469f-a165-70867728950e"), "HitsLog");

    // Resume old subscriptions:
    var handles = await stream.GetAllSubscriptionHandles();
    foreach (var handle in handles)
    {
        await handle.ResumeAsync(this);
    }
}
```

I also ran into problems of the same subscription getting duplicated so I used code that removed all the grain's subscription(s) and then re-created it:

```C#
public async Task Subscribe()
{
    var streamProvider = GetStreamProvider("SMSProvider");
    var stream = streamProvider.GetStream<int>(Guid.Parse("0f8fad5b-d9cb-469f-a165-70867728950e"), "HitsLog");

    // Clean up old subscriptions:
    var handles = await stream.GetAllSubscriptionHandles();
    foreach (var handle in handles)
    {
        await handle.UnsubscribeAsync();
    }

    // Create new subscription
    await stream.SubscribeAsync(this);
}
```

### Other Orleans Gotchas / Tips

Streams worked just fine with Azure event hub (via AddEventHubStreams).

Do not use / or other special characters in your grain names with CosmosDB SQL API!

### Orleans Conclusions

I like Orleans and I think it has potential. However, it has a very steep learning curve. Because of my long battle with streams I did not have time to study how clustering/deployment works.

## Dapr

I found Dapr by searching for alternatives to Orleans. It is a bit strange that it too is a Microsoft sponsored project. Maybe they're taking a survival of the fittest approach here.  If they are, I think Dapr will be the survivor.

First of all, Dapr's REST/gRPC based design allows for implementation of actors in any programming language.  I also found it trivial to run everything (actors, state, timers, reminders, events) off a single Redis instance.  Most importantly it only took me about one third the amount of time to get started on Dapr.  This quick startup time is due to Dapr's excellent documentation.

### Actors / Timers / Reminders

Did I just say that Dapr's documentation is excellent?  Well, it is everywhere except for the JavaScript examples.  I spent most of my time on Dapr trying to figure out how to call a method on an actor.  The Dapr Javascript examples have code like this:

```
await client.actor.invoke("PUT", Task.name, `123`, "performTask");
```

That is clearly way out of date.  I had to spend a ton of time code spelunking through the tests/examples of Dapr to coax out these three lines

```
const builder = new ActorProxyBuilder<Task>(Task, client)
const actor = builder.build(new ActorId("123"))
await actor.performTask();
```

There was a similar issue with the code examples to get/set state, so I created a [GitHub issue](https://github.com/dapr/docs/issues/2582) for them.

Other than those hiccups, setting up an actor was a piece of cake.

Setting up timers and reminders on my actor was also very straightforward.  

# State

I was able to very easily configure Dapr to use Postgres for persistence.

One thing I noticed is that there may be a scalability issue with the way reminders are stored.  Dapr stores all the reminders for a specific actor type in a single JSON array.  What happens someone has a massive number of reminders?

![Screenshot of Dapr storing all actor reminders in a single db column.](/assets/images/dapr_reminders_storage.jpg)

### Other Dapr Gotchas / Tips

One thing I noticed while going through the code for the JavaScript SDK is that there weren't very many comments in the codebase at all.  This made it near impossible to figure some things out. For example in the state manager's addOrUpdateState method, there is a 3rd parameter called [updateValueFactory](https://github.com/dapr/js-sdk/blob/1e1a8cbbfc3ec455a5d3c90a9616ae594d2e7c5a/src/actors/runtime/ActorStateManager.ts#L204). Without any comments in the code it is near impossible to tell what that callback is for.

I am also not sure how much I like that the "dapr init" command tries to setup and run a redis container for me.  What if I already have a redis container?  What if I want to use postgres instead? I couldn't find docs that explained how to change what dapr init does.

A note for anyone having trouble getting pubsub to work.  You must run both your publisher and your subscriber with "dapr run":
```
dapr run --app-id try1 --dapr-http-port 3501 --app-port 5005 --config ./dapr/config.yaml --components-path ./dapr/components node .\pubsub_subscribe.mjs

dapr run --app-id try1 --dapr-http-port 3502 --config ./dapr/config.yaml --components-path ./dapr/components node .\pubsub_publish.mjs
```

With actors and pubsub note that it is important to let dapr know what port **your** service is running on by using the --app-port parameter.  pubsub events and actor invocations are sent from the Dapr sidecar to your service by http calls so it needs to know where to send them:

```
// Make sure to set --app-port in your "dapr run" command to match the same serverPort used here
const server = new DaprServer(serverHost, serverPort, daprHost, daprPort);
```

I tested out a small Dapr self hosted "cluster" by starting instances of my pubsub subscriber on two different machines on my home network. It just worked!

### Dapr Conclusions

If you're looking to learn more about distributed applications or the idea of virtual actors, I recommend you start with Dapr.  Orleans was the original pioneer and Dapr is a reboot that takes things to a new level.
