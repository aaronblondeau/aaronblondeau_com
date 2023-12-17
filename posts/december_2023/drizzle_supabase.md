---
layout: blog_post.njk
tags: ['post', 'technology', 'supabase', 'hasura']
title: Drizzle ORM in a Supabase edge function
teaser: Just in the nick of time
cover: /assets/images/supabase_drizzle.jpg
date: 2023-12-16
---

I tried to write this blog post last week but got extremely frustrated and quit.

It was a case of Deno strikes again. Well, not Deno itself, but the lack of good packages available for it. I swear every time I've gone to use Deno I've been blocked by the same issue of some package I need not being available or being dysfunctional.

Take the Drizzle package for example : [https://deno.land/x/drizzle@v0.23.85](https://deno.land/x/drizzle@v0.23.85). **Does not work.** In the back of my mind I knew it wasn't going to work because there is a really obvious mistake in the first example on their readme ("postgres" import vs "pg" usage). Even though I knew it was gonna be crap I still spent about 3 hours trying to troubleshoot it.

The past several times I've evaluated Supabase I've also reached the same stopping point. Everything is great and I'd love to build an app on this platform, but not if I have to fight with Deno imports all day long. Sure I could just host Node.js somewhere else, but that's like towing a wagon behind your minivan. Lame! Because of the lack of npm imports and a few other minor issues I've passed on Supabase and used Hasura with Node.js for all my builds.

Then on Wednesday I found a really awesome surprise in the Supabase team's "launch week" videos on YouTube :
https://www.youtube.com/watch?v=eCbiywoDORw

<iframe width="560" height="315" src="https://www.youtube.com/embed/eCbiywoDORw?si=JgZFiQJzSH7nlPVX" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

NPM support!

I updated my supabase cli and in less than a minute had Drizzle working like I originally planned.

Look at these fantastic npm imports!

```js
// This function fetches all the alerts from the database and returns them as JSON.

// Woo hoo! Use the drizzle-orm npm package!
import { corsHeaders } from '../_shared/cors.ts'
import { drizzle } from 'npm:drizzle-orm/postgres-js'
import { pgTable, pgEnum, uuid, text, timestamp } from 'npm:drizzle-orm/pg-core'
import { InferSelectModel } from 'npm:drizzle-orm';
import postgres from 'npm:postgres'

// Define schema for Dizzle. You can also use Drizzle Kit introspect to auto generate these : https://orm.drizzle.team/kit-docs/overview#introspecting-with-db-pull

// Each alert has a type
const alertTypeEnum = pgEnum("alert_type_enum", ['warning', 'info'])

// Each alert record looks like this 
const alerts = pgTable('alerts', {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
	type: alertTypeEnum("type").notNull(),
  message: text("message").notNull(),
	url: text("url"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).notNull(),
})

type Alert = InferSelectModel<typeof alerts>;

const databaseUrl = Deno.env.get('SUPABASE_DB_URL')!
const pool = postgres(databaseUrl)
const db = drizzle(pool)

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // With deno.land imports, got the following: Cannot convert undefined or null to object
    // However, with supabase 1.123.4 and npm, it works!
    const allAlerts: Array<Alert> = await db.select().from(alerts)

    // Encode the result as pretty printed JSON
    const body = JSON.stringify(
      allAlerts,
      (key, value) => (typeof value === 'bigint' ? value.toString() : value),
      2
    )

    return new Response(body, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error(error )
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
```
