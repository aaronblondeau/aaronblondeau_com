---
layout: blog_post.njk
tags: ['post', 'technology', 'deno', 'javascript']
title: Deno 2 + Jupyter
teaser: Finally a reason to use Deno?
date: 2024-11-08
cover: /assets/images/deno2_jupyter.jpg
---

I watched the original Deno 2 launch video a few weeks ago and now the YouTube algorithm sends me everything they post. I have a good grasp on all the new features in Deno 2 but I'm just not feeling enough pain with Node to switch yet.

Will Deno ever get enough adoption to become the winner? 

I recently jumped through this video titled ["Ryan Dahl introduces Deno 2"](https://youtu.be/H8VLifMOBHU?si=EWWVIJE_7tIMczhK&t=1661). Right at the end he does a section on [Deno's kernel for Jupyter Notebook](https://docs.deno.com/runtime/reference/cli/jupyter/).

Now they've got my attention!

I immediately went to try and replicate what he did in the video. Turns out he did a bit of magic wand waving, but I was able to reproduce what he did as well as a few other examples. See my notebook here : [https://gist.github.com/aaronblondeau/02f94256aab61f409d1f820cc80ea571](https://gist.github.com/aaronblondeau/02f94256aab61f409d1f820cc80ea571)

Unfortunately you'll see in the last cell that it didn't take very long for their npm compatibility promise to break. This isn't entirely Deno's fault due to an import path issue, but I still found a showstopper pretty quickly.

Now Deno may have lost my attention again.
