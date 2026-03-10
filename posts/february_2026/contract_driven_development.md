---
layout: blog_post.njk
tags: ['post', 'technology', 'ai']
title: Me and Claudie Poo
teaser: How an experienced developer is adopting AI
date: 2026-02-27
cover: /assets/images/claudie_poo.png
---

About twenty seconds into trying out [Claude Code](https://claude.com/product/claude-code) I realized that there is no going back on this AI adventure we're all on. My mission as a software developer has always been to be as capable as possible. Now that mission includes my new buddy "Claudie Poo". Going forward, WE need to be as capable as possible together.

That means several things:
1. I can't get stupid by letting Claudie do everything for me, that would let us both down.
2. My role is going to shift upwards towards oversight.
3. Choosing what to work on is going to be more important than ever.

**One : The human has to know what they're doing**

I create the folder structure. I choose which packages we're going to use. I always write the first code. By writing the first class/controller/component in each new unit of code I establish patterns for everything else that AI generates. By sticking to this practice I stay hands on with the code and keep my skills sharp. I also know where everything is.

I am also sticking to my skills development schedule. I like to learn a new language every year. I also try to take a course or read a book on TypeScript every year. The Vue.js docs are an annual must-read too. One of the keys to innovation is knowing what is possible. By continuing to be a code craftsman I will stay well prepared to lead both humans and AI.

**Two : Use tools that bring harmony**

Since that first moment I started using Claude Code I have been adjusting which tools I use in my projects. These 3 have been critical:

- [oRPC](https://orpc.dev/) [(with contract first development)](https://orpc.dev/docs/contract-first/define-contract)
- [Zod](https://zod.dev/)
- [Vitest](https://vitest.dev/)

oRPC has revolutionized how I work. Seamlessly using TypeScript in both frontend and backend is just so insanely efficient. A neat side effect of oRPC is that it moves collaboration between humans and AI towards a more organized codebase. I specifically use oRPC's contract first development capabilities. I the human write a code based contract of what the app should do. Then it is extremely clear for the AI what should be done.

Zod works great with oRPC and helps humans and AI agree on what shape the data in an app should take. As I write each oRPC contract for an app backend I use zod schemas to be very specific about how I want the data to look. Then ol' Claudie Poo can clearly read my intent and create well structured database tables, routers, and so on.

Automated tests always used to take too long to create and maintain. Not anymore! Vitest has been the perfect tool for me to communicate what the final output of the app should be like. By writing automated tests together, Claudie and I can make sure that we're shipping a slop free product.

**Three : Code is cheap but time still isn't**

I recently had Claudie Poo create a custom WordPress plugin for me so that I didn't have to pay a monthly subscription for a feature I needed.  You can build your next startup idea in days only to have someone copy it in hours. Code is no longer an asset. Traction is.

That leaves me at a total loss for my next side project idea. Because I have always focused on the code first I have wound up building the wrong thing over and over. Now, I have no choice but to strike a different path. I just hope I don't wander too long before I find it.
