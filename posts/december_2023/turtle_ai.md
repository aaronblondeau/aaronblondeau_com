---
layout: blog_post.njk
tags: ['post', 'technology', 'ai', 'openai', 'cohere']
title: AI vs Turtle Drawing
teaser: I think my career is safe for a bit longer...
cover: /assets/images/turtle_ai_1.jpg
date: 2023-12-23
---

AI is getting really good at writing code. I've been using [GitHub Copilot](https://github.com/features/copilot) for several months now and it has dramatically boosted my productivity. At the same it has made me dramatically stupider. I've also nearly worn the tab key off my keyboard! I wonder what kind of intersection point there is between AI making you stupider vs more productive.

As I regress in my coding abilities due to my new AI habit I've started to think about how my coding career started and how it is all going to change now.
The very first code I remember writing moved a "Turtle" across the screen to draw shapes. Can AI do what 12 year old Aaron did over 30 years ago?

I decided to find out by giving AI a blank canvas (literally), some commands to work with, and the task of drawing simple shapes. The result is here : [https://turtle-ai.netlify.app/](https://turtle-ai.netlify.app/).

I started out by trying 3 different models : Cohere Command, GPT3.5 Turbo, and GPT4.  I'll add more as API access becomes available. I'd also love to see how a code-specific model performs so stay tuned!

For these 3 the results are very interesting. Given simple tasks like "Draw a blue triangle", I get good results most of the time:

![GPT 3.5 Drawing A Triangle](/assets/images/turtle_ai_tri.jpg)

More complex tasks like "Draw a smiley face" rarely turn out:

![GPT 3.5 Drawing A Smiley Face](/assets/images/turtle_ai_smile.jpg)

My system prompt is here : [https://github.com/aaronblondeau/turtle-ai/blob/main/netlify/edge-functions/lib/openai.ts#L14](https://github.com/aaronblondeau/turtle-ai/blob/main/netlify/edge-functions/lib/openai.ts#L14). I will also continue to fine tune it as I play with this some more. If you have prompt improvement suggestions please let me know!

The most interesting thing to me is how fast these models generate output. If I had to manually write the code to draw a triangle it would take me couple of minutes. For the LLM's it is just a second or two. As AI gets better at writing code, the sheer speed at which it can write will have profound impacts. Code will become extremely cheap and disposable.

The second thing I notice is how there is a boundary where the LLM output quality drops off significantly. How do you know where that boundary is? My prediction here is that quality assurance tooling is going to become very important. Quality assurance analysts are going to play critical roles in making sure AI colors inside the lines. Developers will also need to amp up their QA skills so that they can vouch for the code that their tab key wrote.

As I look towards whatever the AI future holds for software developers I have a lot of anxiety. But at least I have some direction now. I am going to re-task my atrophying brain cells from coding to QA. How about you? What plans/changes are you making because of AI?  Let me know on this post on dev.to : [https://dev.to/aaronblondeau/ai-vs-turtle-drawing-4950](https://dev.to/aaronblondeau/ai-vs-turtle-drawing-4950).
