---
layout: blog_post.njk
tags: ['post', 'technology', 'supabase', 'hasura']
title: Supabase vs Hasura for 2024
teaser: I only have one problem with this...
cover: /assets/images/supabase_vs_hasura_2024.jpg
date: 2023-12-15
---

I have been working really hard to reduce the amount of things I have to know. I'd love to identify and be highly proficient in just a handful of tools that give an individual developer broad powers over technology landscape. For me, right now that set of tools looks like this:

- Hasura + Node.js for backend (includes Mino for S3 storage, and custom JWT code for auth)
- Vue.js + Quasar for frontend
- Capacitor (via Quasar) for mobile

This stack has worked fairly well but I've been feeling quite a bit of friction with it lately. For starters there is GraphQL. It really hasn't lived up to all the hype for me. The primary source of friction has been the GraphQL toolchain. The [Apollo](https://www.apollographql.com/) tools are just way too complex and opaque for me. [URQL](https://formidable.com/open-source/urql/) has been ok in that it is less complex, but also still very opaque. When I say these tools are opaque I mean that they are doing all kinds of things for you behind the scenes that you may or may not want. They then make it very hard for you to undo some of their magic. An example is request caching. Want to flush the cache for a specific GraphQL query? You're going to be spending a couple of hours wading through docs and guess and testing code before you get it figured out. For fun sometime you should try accidentally putting an extra parenthesis character into one of your GraphQL blocks and then watch [codegen](https://the-guild.dev/graphql/codegen) blow up every one of your queries.

I also have some friction with Hasura. The first is the permissions system. Because permissions rules are written as json objects in the Hasura console they are essentially a source of vendor lock-in. Then there is the task of managing user authentication and storing files. Of course you're free to build those out yourself. But then you also have to host those services, and maintain them, and your brain starts to get tired.  [Nhost](https://nhost.io/) is a possible option here but I need to re-visit their offering in a future post.

The final thing that makes me uncomfortable about Hasura is GraphQL subscriptions for realtime data. Behind the scenes they are actually polling database queries once per second. This works, and they've coded up some magic to make it work really well, but for some reason it just really bothers me.

I've been keeping my eye on [Supabase](https://supabase.com/) as a possible one size fits all backend that I can use for all my projects and therefore simplify my go-to technology stack down to this:

- Supabase for backend
- Vue.js + Tailwind for frontend
- Capacitor for mobile

I've been heavily evaluating Supabase the past two weeks and feel like they have put together a really solid developer-first platform. The javascript sdk is definitely a lot more fun to work with than GraphQL. And it comes with [TypeScript typings](https://supabase.com/docs/reference/javascript/typescript-support)!

Here's the overall "things I want in a backend" checklist for Supabase:

- User Authentication - check
- Database - check + smiley face (Postgres is awesome)
- User Authorization - another big check for Postgres and RLS
- File Storage - check
- Realtime - check
- Portability (self hosting) - check
- Efficient Local Dev Workflow - check
- Functions - yes, finally, check
- Job Queues - ?

Dang it. I hate having that last question mark there. Maybe I can rig something up with [Graphile Worker]https://worker.graphile.org/). Maybe I don't need a job queue and edge functions + webhooks will do the job.

What do you think? Anyone out there made the switch to Supabase and loved it? Regretted it?
