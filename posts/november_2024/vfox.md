---
layout: blog_post.njk
tags: ['post', 'technology', 'deno', 'javascript']
title: Version Fox for the Win...dows 
teaser: A sdk manager that works on windows?
date: 2024-11-14
cover: /assets/images/vfox.jpg
---

Not being able to run multiple versions of Node.js on Windows has been one of those things that I haven't fixed for years. I've literally been using the Node.js installer on my Windows box for as long as I can remember.

Then I ran into an issue last week while playing around with Deno where I couldn't get it to upgrade. Since I couldn't remember how I installed it in the first place I couldn't uninstall it either. I finally had to just blow away its folders and manually remove it from my path.

When going to re-install [Deno](https://deno.com/) I noticed [vfox](https://vfox.lhan.me/) as one of their installation options and decided to look into it. I am happy to report that it just works. Even on Windows! Not only does it work extremely well but it supports a ton of my favorite tools : nodejs, erlang, elixir, golang, dart, flutter, [and many more](https://vfox.lhan.me/plugins/available.html).

Having a consistent and easy way to install tools across environments came to my rescue just a few days later. I was trying to build a brand new flutter app and got an error. It turns out the best way to fix this is to install a downgraded JDK. vfox to the rescue! I was able to use vfox to install open jdk 17 in about 10 seconds. Then the handy "vfox cd java" command showed me right where it was installed. I updated my PATH, JAVA_HOME, and ran flutter config --jdk-dir=<path to jdk>. In less than 60 seconds I was up and running again!

So, if you're tired of wrangling [nix](https://nix.dev/), [scoop](https://scoop.sh/), [chocolatey](https://chocolatey.org/), and [nvm](https://github.com/nvm-sh/nvm) across MacOS, Linux and Windows give vfox a try.