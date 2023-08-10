---
layout: blog_post.njk
tags: ['post', 'technology', 'hasura', 'quasar']
title: Startup Starter Kit
teaser: Quick start app templates with Hasura and Quasar.
cover: /assets/images/hasura_base.jpg
date: 2023-08-10
---

I recently read both the [Running Lean](https://leanstack.com/books/runninglean) and the [Company of One](https://www.goodreads.com/book/show/37570605-company-of-one) books. Although they describe very different approaches, both emphasize the idea of starting out by building the **simplest** possible thing that works.

Technology can make simple turn into complex in a hurry. For example, let's say you start a project on Firebase because it appears to be the simplest and quickest way to get a project started. You could definitely build an app very simply and quickly on that platform. But what happens if your early customers ask for a feature that requires geospatial database queries? What if you are asked to provide authentication with a provider they don't support? What if Google kills a feature you're using ([like Dynamic links](https://firebase.google.com/support/dynamic-links-faq), damn it Google!).

When I think about launching MVP apps I like identify a tech stack that will optimize simplicty and speed over the entire life of the project by asking these questions:

- Can I support web both web and mobile, and can I do it with the same codebase?
- Which parts of the tech stack will be at risk of vendor lock in?
- Are there any parts of the product (Data, Files, Authentication, Emails, Background Tasks) that I wont't be able to fully control?
- Where can the application be deployed?
- How many users can the application scale to support?
- Does the development environment offer a high degree of developer productivity?
- What happens if any of the service providers I use go out of business?
- How many technologies would other developers need to know to work on it?

Having asked these questions many times over the past few years I currently use the following as my optimal tech stack:

[Postgres](https://www.postgresql.org/) : For me Postgres is a no-brainer because there are very few use cases that it cannot handle. It is also extremely easy to host and is supported on all major cloud providers. Providers like [Neon](https://neon.tech/) are also now offering serverless Postgres at really low costs.

[Hasura](https://hasura.io/) : When developing an MVP you need to move fast and **not** break things. Hasura provides an absolutely brilliant framework for rapidly developing your app backend. Hasura is designed in a way that provides strong guardrails while offering extreme flexibility. I have yet to find a use case that it cannot support. Hasura's GraphQL engine is open source and easy to self host. However, this is the riskiest part of the architecture as it would be very difficult to replace should they stop developing it.

[Node.js](https://nodejs.org/en) : I like to pair Hasura with Node.js to implement my authentication workflow, custom GraphQL actions, event handlers, and custom API endpoints. Node is very easy to host. Using JavaScript for both the backend and frontend also helps with developer productivity. Node has a large ecosystem and has packages for pretty much anything you can imagine. [MJML](https://mjml.io/), [Prisma](https://www.prisma.io/), and [BullMQ](https://docs.bullmq.io/) pair really well with Hasura to fill out backend functionality.

S3 : For file storage, S3 is currently the standard. Thankfully, using S3 doesn't lock you into using AWS. There are tons of providers out there that provide S3 compatible storage and you can even host it yourself with [Minio](https://min.io/).

[Quasar](https://quasar.dev/) : To top things off I use Quasar. VueJS is my favorite UI framework and Quasar comes with a set of UI components that get things moving quickly. Quasar also comes with support for [Capacitor](https://capacitorjs.com/) so deploying a mobile app is close at hand.

[Render.com](https://render.com/) : I currently like to host this stack on render.com. I've also gotten things running on [Fly.io](https://fly.io/), but automated deployments are way easier on render.

To make it really easy to use this tech stack I have assembled two starter projects:

[Hasura Base](https://github.com/aaronblondeau/hasura-base) : This project is an all batteries included configuration that includes everything you'd need to quickly launch an app : GraphQL API via Hasura, user authentication via Hasura, background tasks via BullMQ, formatted email messages via MJML, file storage API endpoints via S3/Minio. Everything is packaged and easy to run via Docker Compose.

[Hasura Base Quasar](https://github.com/aaronblondeau/hasura-base-quasar) : This project is a UI starter that includes the full user authentication workflow : login, register, forgot password, profile edit (with avatar), change password, change email, email verification.

My hope is that you will be able to clone these two projects and have an app up and running in under 15 minutes. I also hope that your new app will be a joy to work on for the duration of your project!
