---
layout: blog_post.njk
tags: ['post', 'technology', 'node', 'express', 'openapi']
title: Can I stop forgetting to update my OpenAPI docs?
teaser: '"Did you remember to update the OpenAPI docs for that API endpoint you modified earlier today?"", says my brain at three in the morning.'
cover: /assets/images/joi-swagger-express.jpg
date: 2022-11-02
---

"Did you remember to update the OpenAPI docs for that API endpoint you modified earlier today?", says my brain at three in the morning. I decide to put a book on the floor so when I get up I'll see it and remember. Then, when I wake up: "What the heck is this book here for?"

I have been using OpenAPI (Swagger) docs for my Node.js APIs for quite some time. All that time I have been using [JSDoc](https://www.npmjs.com/package/swagger-jsdoc) to define the swagger specs for my endpoints and the schemas that they accept and return. This has worked very well except for the fact that whenever I add a new field to a model in my API I tend to forget to add it to the docs.

Earlier this week I discovered the [Joi npm package](https://joi.dev/) while reading through the [ArangoDB docs](https://www.arangodb.com/docs/stable/foxx-getting-started.html). A light bulb immediately went off in my head. Can I use Joi to validate inputs AND generate OpenAPI specs?  Fortunately the answer is yes, and the setup is very simple.  See the code setup here : [https://github.com/aaronblondeau/joi-swagger-express/blob/main/index.js](https://github.com/aaronblondeau/joi-swagger-express/blob/main/index.js)
