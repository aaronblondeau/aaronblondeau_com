---
layout: blog_post.njk
tags: ['post', 'technology']
title: Bow to the rectangle
teaser: What is going on with logins?
date: 2025-02-12
cover: /assets/images/surveil.jpg
---

Here are the steps I had to take to login to Facebook Business Manager recently:
1) Go to Facebook. I'm logged out again even though I just logged in earlier in the day.
2) Use password from my password manager.
3) Use code from authentication app.
4) Try to go to business manager.
5) It asks to validate business email.
6) Get code from business email and put that in.
7) It says my access is restricted and I have to wait 37 minutes to access business manager. Not sure where they came up with 37 but I have seen all kinds of random wait times with this.
8) Wait the 37 minutes.
9) Get asked for authentication code again.
10) Finally get to business manager, but it took so long I forgot what I was going to do there.

Logging in to anything these days requires multi-factor authentication. I have come to refer to getting 2FA codes as "**bowing to the rectangle**". (In my culture, being forced to bow down to something is a demeaning and humiliating experience) 

I totally understand that our tech overlords have to address the problem of people using insecure passwords and hackers stealing browser sessions and so on. However, I get the feeling that something else is going on. What is next for Facebook login steps? Is 3FA (three factor authentication) where they come to my house and swab me for my DNA next time I try to login?

I have a neighbor who doesn't have a cell phone or a computer. He doesn't have to bow to the rectangle. Yet. I just have this feeling that with the rise of AI and the automation of everything that they will make him bow too. Good luck paying your electricity bill or getting a Dr. appointment without good old two factor authentication.

I have been thinking about this for several weeks and I have only identified three very imperfect solutions developing applications that don't require onerous authentication:
1) Fully anonymous users
2) Peer to peer applications
3) Public key (Web3/crypto) style authentication

For solution #1 there is only a small set of applications that you can create with no user authentication. To try my hand at this and to continue the conspiratorial theme of this post I created an app called [X-Skies](https://x-skies.com/). X-Skies is an app that lets anyone post or observe Drone and UFO sightings. It was really hard for me to adjust to building an app without a login. Some design work also had to go into figuring out how to prevent abuse of a system where everyone is anonymous.

For solution #2 there is a much broader range of applications that are possible. Frameworks like [Socket Supply Co](https://socketsupply.co/) and tools like [PeerJS](https://peerjs.com/) are also available. However designing a peer to peer application that is useful and accessible to ordinary users is going to be very hard.

If you can't get ordinary folks to even use secure passwords without losing them then solution #3 is a real long shot.

So, where does this road take us. Will we have to sacrifice our privacy and dignity by being forced to use more and more invasive authentication methods. My iPhone already has my face. What will it want next?

I think that we as developers are going to need to find some innovative ways to serve people with technology without demeaning them. If we don't we'll wind up with [the mark](https://www.gotquestions.org/mark-beast.html).

--

[Cover Photo by Pixabay from Pexels](https://www.pexels.com/photo/grey-bullet-camera-274895/)
