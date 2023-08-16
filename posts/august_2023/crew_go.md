---
layout: blog_post.njk
tags: ['post', 'technology', 'go', 'crew', 'redis']
title: Crew-Go
teaser: Crew-Go is a highly adaptable and fault tolerant task orchestration tool.
cover: /assets/images/crew_go.jpg
date: 2023-08-16
---

Crew-Go [https://github.com/aaronblondeau/crew-go](https://github.com/aaronblondeau/crew-go) is an open-source project that I have created to help fill a gap among existing background task processing tools. I created Crew-Go because I needed a tool that made it easier to work with the Facebook Marketing API. The Facebook Marketing API is extremely challenging to work with because:

- It crashes regularly
- If it isn't crashing it is throwing random errors
- It has aggressive rate limits
- It requires complex sequences of calls to create ads

With this set of challenges, I found it very difficult to find a tool that allowed Orchard to build ads reliably. There are plenty of great background task managers out there like [BullMQ](https://docs.bullmq.io/), [Celery](https://docs.celeryq.dev/en/stable/getting-started/introduction.html), and [Temporal](https://www.temporal.io/). However, none of them fit my use case very well as I needed the following features:

- Complex parent / child task structure (directed acyclic graph)
- Pause and resume groups of tasks when rate limit errors happen.
- Continuations (tasks can create child tasks)
- Delayed, scheduled tasks
- Can manage rate limit errors by automatically pausing all tasks in same workgroup
- Avoids redundant tasks
- Workers can be written in any language - all workers are simply webhooks.
- Provides a user interface that makes manual interventions easy
- Easy to customize
- Easy to host - can compile to single .exe.

Crew-Go is implemented with Go and is my first attempt at building a large scale Go application. Crew-Go has been used in production environments at [Orchard](https://orchard-insights.com/) for about 6 months now and I am extremely happy with how reliable and helpful it is. I would love to share this tool with others, get feedback on it, and make improvements. Please try it out and let me know what you think!
