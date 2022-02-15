---
layout: blog_post.njk
tags: ['post', 'technology', 'javascript']
title: Initial Discovery - Lit
teaser: There has to be a simpler way to build web apps.
cover: /assets/images/lit_1.jpg
date: 2022-02-15
---

The current state of front end JavaScript development is not good.  Angular, React, Svelte, and even now Vue have become too over-engineered.

I'm trying to do something relatively simple. Assemble a collection web elements that will dynamically update as users interact with them.  Why do I need a massive toolchain to pull that off?  Is there a simpler way?

[WebComponents](https://developer.mozilla.org/en-US/docs/Web/Web_Components) have been around for quite a while but I have never directly created one.  I hadn't even read up on [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) till yesterday!  Could the use of WebComponents provide a path to a more sustainable web development workflow?

After some research I decided it would be a pain to manually compose html and css strings so I decided to use a small library called [Lit](https://lit.dev/) to help me build my first components.  Here they are in all their glory:

![Animation of Lit Components](/assets/images/lit_demo_2.gif)

Here are the core competencies that I wanted to explore:
- Multiple components - one nested inside another
- Reactivity within a component
- Passing events up to parent component
- Passing properties down to child component

I only ran into two issues during the setup:
1) I decided to use snowpack to run my dev environment.  That worked smoothly, but blew up when I tested a "snowpack build". I got this: **error: Expected ";" but found "render"** This took a long time to resolve, but I eventually changed noImplicitOverride to false in tsconfig.json. It turns out snowpack was unable to handle the JavaScript generated from the "override" keyword.
2) I had a hard time setting the "selected" attribute within an option on my select.  Thankfully Lit has some great docs and I found how to do [boolean attributes](https://lit.dev/docs/templates/expressions/#boolean-attribute-expressions) to resolve that.

Otherwise this looks like there could be a ton of potential.  I liked the feeling of working closer to the browser.  I am going to be adding on to this in the coming weeks.

Here is my repo : [https://github.com/aaronblondeau/lit-starter](https://github.com/aaronblondeau/lit-starter)

