---
layout: blog_post.njk
tags: ['post', 'technology', 'mentalhealth']
title: Hack your DNS for better focus
teaser: Block dopamine dealers while you're working.
date: 2025-03-01
cover: /assets/images/stop.jpg
---

Keeping on top of what is flowing in and out of my house on the internet has been critical for my kids' mental health. Ultimately they will need to be able to moderate their own behavior online. In the meantime it is my job to make sure that the dopamine dealers stay out.

Same goes for me too. My dopamine dealer is YouTube. Every time I run into a difficult problem at work my brain says, "Hmmm, that looks hard, let's take a quick YouTube break." Then two hours later I find that difficult problem still waiting for me.

I've used [NextDNS](https://nextdns.io/) for years to keep our home internet safe for the kids and it works really well. Fortunately NextDNS offers API access that you can use to automate turning different internet filters on and off. Unfortunately their API docs are horrible.

Here is how I setup a tool that automatically blocks YouTube during working hours.

**Step 1 : Get an API key.**

To find your NextDNS API key head to your profile page and look in the API section.

**Step 2 : Add YouTube to the "Websites, Apps & Games" section of the Parental Control tab.**

![Screenshot of NextDNS parental control tabs showing YouTube added to list.](/assets/images/dns_blog_post_1.png)

**Step 3 : Forget about the [NextDNS API docs](https://nextdns.github.io/api/). Use a browser inspector to figure out how to turn off or on the filter**.

I couldn't make much sense of the NextDNS API docs and almost gave up on this one, but then I decided to see if I could reverse engineer the calls from their own web UI. I opened up the inspector, cleared out the network traffic and then toggled the YouTube filter on and off. Sure enough the URL and payload to turn the filter off and on was easy to pick out:

![Screenshot of browser inspector panel showing fetch requests from enabling and disabling YouTube filter.](/assets/images/dns_blog_post_2.png)

**Step 4 : Use Deno to create a simple script and cron**

Using the information you gather from the browser inspector, create fetch calls that will make the same request. The fetch should use your API key in a X-Api-Key header.

```JavaScript
async function updateYouTube(active = false) : Promise<void> {
  await fetch('https://api.nextdns.io/profiles/YOUR-PROFILE-ID/parentalControl/services/hex:FIND-ME-IN-INSPECTOR', {
    method: 'PATCH',
    headers: {
      'X-Api-Key': Deno.env.get('NEXTDNS_API_KEY') || '',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(
      { active }
    )
  })
}

// Good tool to help debug timezone day/time differences:
// https://savvytime.com/converter/utc-to-co-denver/jan-13-2025/3-30pm

// Switch to standard at 6pm M-F
Deno.cron("Set standard profile", "3 1 * * 2-6", async () => {
  console.log('~~ setting standard profile')
  await updateYouTube(false)
});

// Switch to workday at 9am M-F
Deno.cron("Set workday profile", "3 16 * * 2-6", async () => {
  console.log('~~ setting workday profile')
  await updateYouTube(true)
});
```

Note that it may take some brain wattage to get the cron times correct due to timezone issues.

**Step 5 : Host on [Deno Deploy](https://deno.com/deploy)**

The folks at Deno have made hosting scripts like this extremely easy. The Deno.cron statements above work without any extra config! I just put my code into a GitHub repo and linked it to my account to deploy : [https://docs.deno.com/deploy/manual/how-to-deploy/](https://docs.deno.com/deploy/manual/how-to-deploy/). Don't forget to setup the NEXTDNS_API_KEY environment variable in the service's settings.

--

[Cover Photo by Alexander Kovalev from Pexels](https://www.pexels.com/@alscre/)
