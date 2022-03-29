---
layout: blog_post.njk
tags: ['post', 'technology', 'javascript', 'hasura', 'dotnet']
title: A Node.js Developer Tries .NET
teaser: How hard can it be to make an API endpoint that takes accepts a simple POST request?
cover: /assets/images/hasura2.webp
date: 2022-03-28
---

"You put up quite a fight .NET, you wore me down and made me cry, but I eventually overcame your extraordinarily unhelpful help and won!", I proudly thought.  Then I added up the amount of hours it took to port my Node app to .NET.  This was a miserable failure.

- How hard can it be to make an API endpoint that takes accepts a simple POST request?
- How hard can it be to run that API on the port I want?
- What if I try and configure that port number with an environment variable?
- How hard can it be to cache some data with Redis?
- How hard can it be to send emails in the background?

Working with .NET it turns out the answer to all the above is to give up, turn off your computer, go home, learn how to crochet, start selling little crocheted figures on etsy, that's your new job now.

The goal was simple.  I wanted to create a clone of my [NodeJS API that I run as a support service behind Hasura](https://github.com/aaronblondeau/hasura_starters/tree/master/dotnet).  It does things like authenticate requests, add custom actions to the GraphQL API, and execute background jobs. All of this is pretty simple everyday stuff.  Since deciding to re-visit .NET (after a 10 year absence) I thought this would be a good project to help me re-learn the platform.

However, there was one huge issue I failed to foresee : I could not find an intuitive way to do **anything** with .NET. If I were to invest the enormous time it takes to get into the framework then I'm sure I could get a lot of things memorized and move around pretty well. But, who has time for that?

Take for example, this super hip password reset page I made : https://github.com/aaronblondeau/hasura_starters/blob/master/dotnet/Pages/PasswordReset.cshtml#L3

Should be easy enough:
- Basic HTML for a form
- Post route to handle form
- Re-render form on error, redirect on success

I spent at least four hours trying to get this to work. Turns out that you must have this little "@addTagHelper" statement along with an "asp-for" attribute in the form. It absolutely would not submit a raw form post to my [OnPostAsync](https://github.com/aaronblondeau/hasura_starters/blob/master/dotnet/Pages/PasswordReset.cshtml.cs#L28) without this magical combination. **WHY???** How come I can't make a super simple form like this.

I'm sure most of this has to do with my perspective.  I've primarily worked with Node, Python, and Dart (Flutter) for the past year.  Dart and Python I learned recently and they did not get in my way like .NET does. Maybe the Microsoft tools try to do too much for you, and the loss of freedom that causes is too much for me to get my head around.

Maybe I need an easier intro project to help me learn.  Suggestions?
