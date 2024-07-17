---
layout: blog_post.njk
tags: ['post', 'technology', 'dapr', 'python']
title: Distributed Actors in Python with Dapr
teaser: A complete working example of using Dapr with Python
date: 2024-07-16
cover: /assets/images/python_dapr.png
---

What makes a worse header image - my hand drawing of an airplane, or yet another super lame AI generated picture?

Anyways, imagine a scenario where you are asked to build a an app for an airplane banner message startup called "AirDisplay". AirDisplay is going to completely disrupt the towed airplane banner industry with electronic banners. Instead of planes having to return to the airport to pickup a cloth banner for each message these electronic banners can be updated instantly via the app!

---

*Won't the banners be too heavy to flutter nicely behind the airplanes?*

*Well, the investors already gave us millions of dollars for mentioning AI in our pitch so we have to build it now.*

*The app will need a way to keep track of each banner that exists in the physical world. It will need to always be certain about the current state of each banner so that the user interface can be kept up to date in realtime. It will also need to make sure that user's messages don't overwrite each other (messages show for 60 seconds and then disappear). Finally, it will need to be scalable so that we can support millions of banners at once.*

*Wait, how many banner towing airplanes are out there?*

*I also put the word 'scale' all over my pitch deck. When will you have a demo ready?*

---

If you try and cook up a simple rest api for this things will go great until you remember that user's messages can't overwrite each other. You will have a race condition if two users submit messages at exactly the same nanosecond. Two common options to solve race conditions are:
1) A locking mechanism like Postgres' [SKIP LOCKED](https://www.postgresql.org/docs/current/sql-select.html), or Redis' [distributed locks](https://redis.io/docs/latest/develop/use/patterns/distributed-locks/).
2) The [actor model](https://en.wikipedia.org/wiki/Actor_model).

Both methods will solve the problem but you are going to have to be pretty smart to use a locking mechanism successfully. Locking also won't solve some of the other needs like streaming realtime updates to the UI.

There are a lot of great actor frameworks out there:
- Go has [goakt](https://github.com/Tochemey/goakt)
- .Net has [Orleans](https://learn.microsoft.com/en-us/dotnet/orleans/overview)
- The JVM has [Akka](https://akka.io/)
- Actors are built in to [Elixir](https://elixirschool.com/en/lessons/intermediate/concurrency)
- [Dapr](https://dapr.io/) (supports multiple languages)

The compelling reason to use Dapr is that it includes some other tools that help solve AirDisplay's requirements : [state management](https://docs.dapr.io/developing-applications/building-blocks/state-management/), [pubsub](https://docs.dapr.io/developing-applications/building-blocks/pubsub/), and [reminders](https://docs.dapr.io/developing-applications/building-blocks/actors/actors-timers-reminders/).

Unfortunately it was extremely difficult for me to process Dapr's documentation into a demo for AirDisplay. The three areas where I struggled were:
1) I failed to understand that I needed my own server **always** running alongside Dapr in order to use pubsub or actors. I thought I could drive my workflows simply by using a client.
2) Configuring Dapr was very difficult due to scattered documentation and incorrect examples.
3) A complete working set of example code in Python was difficult to find.

For item 1, this is how I now visualize the basic architecture of running an app with Dapr.

![Dapr Server and Sidecar model](/assets/images/dapr_server_relationship.png)

For items 2 and 3, here is the complete codebase : [https://github.com/aaronblondeau/python-dapr-demo](https://github.com/aaronblondeau/python-dapr-demo)

The example code includes:
- An actor example (actor state uses a Pydantic class)
- Uses Dapr state storage to maintain Actor's state
- REST API endpoints that interact with Actor
- Actor reminder example
- Actor state changes -> pubsub -> websocket -> UI
- [Dapr's integration with FastAPI](https://docs.dapr.io/developing-applications/sdks/python/python-sdk-extensions/python-fastapi/)
- A simple UI made with [Alpine.js](https://alpinejs.dev/)

Hopefully this example will get you started much more quickly on your competitor to AirDisplay now that I have blown our cover here in this post.
