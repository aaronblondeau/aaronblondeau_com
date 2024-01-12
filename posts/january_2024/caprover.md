---
layout: blog_post.njk
tags: ['post', 'technology', 'caprover', 'docker', 'devops']
title: CapRover
teaser: Dumb name, awesome tool
cover: /assets/images/caprover.jpg
date: 2024-01-11
---

[Render.com](https://render.com/) raised their prices last year. Their "Starter" instance type (512 MB / 0.5 CPU) is $7 per month. The next step up is their "Standard" instance type (2 GB / 1 CPU) which increased to $25 per month. Most of the services I manage are too big for a 512MB instance and to small for the 2Gb instance. If you're up for a laugh go check on the pricing of their 4GB and above instances. Current pricing is [here](https://render.com/pricing). On render.com you can only run one app (container) per service so there isn't a way to leverage extra capacity either.

So how am I going to cost effectivly host all of our services now? One option is to run everything on a self hosted VM using a combination of github deploys, PM2, and Caddy which [I wrote about a while back](https://dev.to/aaronblondeau/automatic-deploys-with-pm2-caddy-and-github-actions-5455). While extremely reliable, that setup has some issues. The main one being that it results in a very opaque configuration that would be nearly impossible for someone else to maintain.

Enter [CapRover](https://caprover.com/). 

Wait a second... "CapRover"?  Rover is definitely a funny dog name, but something about CapRover is really annoying to me. There has to be a much cooler play off the word "captain" for a tool like this. I honestly almost didn't try it out because of the name, but I sure am glad that I did.

CapRover is an open source platform as a service. Send your code and it'll run it with [docker](https://www.docker.com/) and proxy it with [nginx](https://www.nginx.com/). I found it to be one of those great open source projects that just worked for me. No weird hacks or gotchas.

Here are my favorite things about it so far:
- Great documentation. Every time I had a question I found exactly what I needed in the docs.
- Easy setup. Create a VM > Install Docker > Point a domain at it > Run the setup script > Boom - done.
- [Let's Encrypt](https://letsencrypt.org/). CapRover automatically configures each service with nginx. SSL certificates (on multiple domains too) are just the click of a button.
- Automatic deploys. For GitHub deploys CapRover creates a webhook for you to add to your repo. No complicated github actions.
- [Clustering](https://caprover.com/docs/app-scaling-and-cluster.html). The docs indicate that you can setup a cluster. I didn't try this out myself but it helped me feel confident that I could scale up if needed. 
- It's just docker + nginx. Under the hood CapRover is just a thin wrapper around these two phenominal tools. I love the simplicity of it all.
- Maintainable. If someone new ever needs to take over managing these services they can just log in to CapRover, see how everything is setup, and go from there.

Things I didn't like about CapRover:
- I wound up needing to create a custom Dockerfile for projects that had run on render.com's node.js runtime. This is actually a good thing. Now I can run them pretty much anywhere.
- It looks like quite a few of the [One-Click Apps](https://caprover.com/docs/one-click-apps.html) are out of date, but you can manually update the image tag.
- With a self-hosted solution there isn't anyone to blame if something goes wrong. For my CapRover instance I make sure to regularly snapshot the VM so that I can quickly restore if needed. Definitely can't promise very many 9's of uptime with a rig like this.
- Finally, I kinda wonder if CapRover is still alive. As I write this it has been over 60 days since there has been any [activity on their GitHub](https://github.com/caprover/caprover/activity).

<iframe src="https://giphy.com/embed/eRppSyIp9brag" width="480" height="284" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/dumb-and-dumber-jim-carrey-eRppSyIp9brag">via GIPHY</a></p>

In this age of rapidly increasing costs, a tool like CapRover can unlock huge savings. I highly recommend you give it a try.
