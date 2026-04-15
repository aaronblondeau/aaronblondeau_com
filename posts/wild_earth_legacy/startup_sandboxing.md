---
layout: blog_post.njk
tags: ['post', 'technology', 'startup']
title: Startup Sandboxing
teaser: Make it easy to sell your startup.
cover: /assets/images/startup_sandboxing.png
date: 2026-04-08
---

Transferring ownership of a car is straightforward. You hand over the car, keys, and the title and you're done. Wouldn't it be nice if selling a startup was that easy too?  Aside from all the legal work that needs to happen when selling a business you can make transferring ownership of a startup easy too. It all comes down to "sandboxing" your startup.

In technology a "sandbox" is an isolated environment that provides all the resources an application needs so that it won't affect other applications. When building a startup it is important to think about all the resources needed from the beginning so that you can box them all up for a future buyer. Some of the most important resources are:

1) Domain Name and DNS
2) Email Accounts, File Storage, and Messaging Apps
3) Credit Cards
4) Code and Intellectual Property
5) Servers
6) Cloud Services (AWS, resend, etc...) 

It all begins with the domain name. Make sure that you fully own and control your domain name. Use a registrar that makes it easy to transfer or share domains with other users. Namecheap or CloudFlare are two of my favorites. In addition, make sure you are using a DNS provider like CloudFlare that makes it easy to import and export DNS zone files. Your buyer's technology team will be extremely grateful to be able to take control of the domain name and DNS without having to perform any risky transfers or migrations.

Next, setup standalone email accounts for your startup. I like to create an admin@mydomain.com email inbox (or alias) that I use to register for all further services that the project will need. Then create additional accounts for your team. I really like to use Zoho for email and documents because of it's low cost. The low cost makes it easy to create separate accounts for each project.  Store all intellectual property in these accounts. Make sure all code is stored in an account (GitHub) that is owned by the primary email for the project.

It is a major pain to have to cancel widely used credit cards because you're not sure if the new owner will remove them from all the services you were using. If possible, always use virtual credit cards when setting up payments for all of your startup's services. Ideally you'll use a different card for each service. Both found.com and privacy.com are great solutions for this. For example, when setting up Zoho for email like I recommended above, use a unique virtual card. When setting up an AWS billing account for the servers, use a different virtual card. Once you've handed off a project to a new owner all you have to do is turn off the virtual cards and you don't have to worry about accidental charges or billing issues with any of your other projects.

It is critical that you make sure all services that you signup for use a dedicated email account that belongs to the project. Anytime you create an account for services like MailJet, AWS, Google Cloud, Digital Ocean, etc... use the dedicated email account. Keep all servers, file storage,  and databases for the project sandboxed within these accounts. During handoff, simply transfer the email account and logins to the new owner, and they'll have the car.

Finally, make sure you use a password manager like LastPass or BitWarden to create a complex and unique password for each and every account that you create. Make sure you use a password manager that allows you to share credentials with other users. Never share passwords for critical services via email, or text messages. Then during handoff you can simply share the credentials with your buyer via the password manager and they'll have the keys.
