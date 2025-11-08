---
layout: blog_post.njk
tags: ['post', 'technology', 'kottster']
title: Who wants to build an admin UI?
teaser: Use Kottster to quickly create an admin UI for your app.
date: 2025-10-07
cover: /assets/images/kottster1.jpg
---

[PocketBase](https://pocketbase.io/) is my favorite tool for rapidly prototyping app ideas. One of the main things that I love about it is the extremely capable admin UI it comes with. Aside from asking non-technical users to edit JSON columns you can get really far with it.

**Having an admin UI for free saves enormous amounts of development time and lets me focus on other more MVP critical areas.**

I discovered [Kottster](https://kottster.app/) a few weeks ago and decided to try it on one of my non-PocketBase projects. However, I abandoned it pretty quickly because at the time you had to login with their hosted authentication service and there was no way to completely self host it. They must have heard my loud sigh of exasperation because they recently announced full-self hosting support : (https://kottster.app/blog/kottster-is-now-fully-self-hosted)[https://kottster.app/blog/kottster-is-now-fully-self-hosted]

Huge props to the Kottster team for recognizing that as a roadblock to adoption and addressing it!

Like the PocketBase admin UI, Kottster gets you really far out of the box. You can view and edit the tables in your database and you can also create dashboards for displaying query results.

Kottster operates in a neat way where as you create dashboards or table views in your instance it creates the code for them within your project's directory. This allows you to easily customize them as well as keep them in a code repo.

Kottster also allows you to create custom admin pages where you are set loose with a react component for the frontend page content, and a server side controller for the backend.

Here is what some of the server side code looks like:

```TypeScript
import { app } from '@/_server/app';

/*
 * Custom server procedures for your page
 * 
 * These functions run on the server and can be called from your React components
 * using callProcedure('procedureName', input)
 * 
 * Learn more: https://kottster.app/docs/custom-pages/api
 */

const controller = app.defineCustomController({
  // Define your procedures here
  // For example:
  getMessage: async (input: { name: string; }) => {
    return { message: `Hello, ${input.name}!` };
  },
  getSetting: async () => {
    // .env files work just fine
    return { value: process.env.WIDGET_SETTING }
  },
  getWidgets: async (input: { page: number, perPage: number }) => {
    // I had to reverse engineer things to create this code,
    // but direct access to the db via knex is available!

    // Another cool note is that the input and output types of
    // procedures are available in the frontend react component!

    const pg = app.dataSources[0]
    const client = pg.adapter.client
    const results = await client.from('widgets').select('*').limit(input.perPage)
    const totalResult = await client.from('widgets').count('*')
    return { widgets: results as {
      id: string
      name: string
      description: string
      // A json col...
      options: {
        label: string
        value: string | number | boolean
      }[]
      created: Date
      updated: Date
    }[], totalWidgets: totalResult[0].count }
  }
});

export default controller;
export type Procedures = typeof controller.procedures;
```

Calling a backend procedure from the frontend React component is really easy:

```TypeScript
const widgets = await callProcedure('getWidgets', { page: 1, perPage: 20 })
```

[See my next post for info on how to create custom field editors for Kottster! ](/posts/november_2025/kottster_fields/)

I'd highly recommend you give Kottster a try. It seems like a fairly young project but is on a good trajectory and solves a problem that I think a lot of devs have.
