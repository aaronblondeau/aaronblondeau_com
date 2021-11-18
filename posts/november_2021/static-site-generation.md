---
layout: blog_post.njk
tags: ['post', 'technology']
title: Creating My New Site With 11ty
teaser: Even the smallest projects can be derailed from the start by hidden complexity.
cover: /assets/images/11ty.jpg
---
I had a budget of about 6 hours to create my new website.  First thing I did was outline these requirements:

- Portable.  The reason all my past posts are gone is because they are in old WordPress or Duda sites where they will be hard to recover.
- Cheap.  Most site creation platforms like Squarespace, Duda, and Wix cost around $15 per month.  Over the course of several years that cost adds up.
- Full Control.  I wanted to have the ability to completely control every piece of HTML, CSS, and JavaScript output to the browser.
- Secure and Stable.  My time budget has no room for messing around with out of date plugins or hacked WordPress instances.

I quickly settled on using a markdown based static site generator.  This immediately resolved three of the four requirements.  Using markdown would make my content highly portable.  Static sites can be hosted for free on services like [Netlify](https://www.netlify.com/).  I imagine that a static site would be pretty hard to hack.  Maybe I can even host it on IPFS!?

Now, which one...

I started with Hugo and didn't feel right about it almost immediately.  On step 3 of their [quickstart](https://gohugo.io/getting-started/quick-start/) you are prompted to install a theme.  This didn't work for me because I hadn't installed the "extended" version.  Hidden complexity is a huge red flag when creating a new project.  Two minutes in with Hugo I had hit two pieces of hidden complexity:

- Why does Hugo have regular and "extended" versions?
- What makes up a Hugo theme?  How hard is it to make or customize one?

I realized that their tagline of "The world’s fastest framework for building websites" doesn't line up with any of my goals either.  So, immediate bail on Hugo.

I started looking at other static site generators, and then I saw a tagline that made me smile :
"[Eleventy](https://www.11ty.dev/), a simpler static site generator."  Just a few moments later I had 11ty up and running.  A few minutes after that and I had some basic pages setup.  Next I started at copying and pasting a template from [HTML5Up](https://html5up.net/) into the site.

Unfortunately it took me a little while to learn where to put images and other static assets.  I finally found [eleventyConfig.addPassthroughCopy](https://www.11ty.dev/docs/copy/) which did the trick.  I have to think some more about the implications of this.  Wouldn't it be simpler if 11ty came with an assets folder configured?  Is this hidden complexity too?

Here I am only a few hours into starting the project and I'm already working on the most important thing - creating content!  I also feel really good about the fact that each of my posts is human readable markdown.  My images and other resources are also local and unlikely to get separated from the content they belong with.

I will provide updates if/when I run into issues with Eleventy.
