---
layout: blog_post.njk
tags: ['post', 'technology']
title: GitHub Codespaces
teaser: Running a Python project on a M1 Mac?  Not going to happen.  Codespaces to the rescue!
cover: /assets/images/codespaces.jpg
date: 2021-12-05
---
I've been using [VSCode devcontainers](https://code.visualstudio.com/docs/remote/containers) for quite a while in order to quickly onboard new team members.
You can hand them the repo, show them how to open the project in the devcontainer, send over a few credentials and they're up and running.

Till Apple gets involved that is.  We just lost two entire days trying to get a Python project to run in a devcontainer, natively, in a VM, any way at all on a M1 Mac. Our Dearest Supreme Overlord says "no" so we'll have to find another way.

I've had great experiences developing on cloud based Virtual Machines in the past.  However, it gets difficult when you give a cloud based Linux machine to someone who doesn't have a ton of Linux experience.  They either can't figure it out, or you get a Slack message every 30 minutes asking for help.  If only there were a way to launch new development environments at the click of a button!

I quickly settled on [GitHub Codespaces](https://github.com/features/codespaces) and was happy to see that they totally nailed it:
- The container launched quickly and installed all our Python dependencies in a snap.
- The repo was cloned straight into the container and all git commands work without any extra setup.
- Access to the dev environment worked great in the browser.
- The VSCode [GitHub Codespaces extension](https://marketplace.visualstudio.com/items?itemName=GitHub.codespaces) opened up the dev environment on my dekstop too.
- Spaces restart quickly and keep things right where you left off.

I did almost ran into a showstopper.  How am I going to get connected to our dev database which runs in Google Cloud SQL and needs a whitelisted IP address in order to connect?  This is where I give huge props to the GitHub Codespaces engineering team:

You can configure your devcontainer with "docker in docker" (moby) support which allows for a super simple way to launch the Google Cloud SQL proxy:

```
docker pull gcr.io/cloudsql-docker/gce-proxy:1.19.1
docker run --rm -d \
-v /workspaces/pathto/my_service_account.json:/config \
-p 127.0.0.1:5432:5432 \
gcr.io/cloudsql-docker/gce-proxy:1.19.1 /cloud_sql_proxy \
    -instances=my-instance-id:and-location:and-name=tcp:0.0.0.0:5432 -credential_file=/config
```

Same with running redis in the Codespace:

```
docker pull redis
docker run --rm --name local-redis -p 6379:6379 -d redis
```

I did have to recreate my devcontainer to add support for container-in-container for the commands above to work.  Here is how I did it:

Started with the "Codespaces: Add Development Container Configuration Files" command in VSCode:

![](/assets/images/codespaces_devcontainer_wizard.jpg)

Then, on the final step checked the "Docker (Moby) support (Docker-in-Docker)" option:

![](/assets/images/codespaces_docker_in_docker.jpg)

The final thing I was impressed by was how they made it easy to "forward" ports from your devcontainer to the web:

![](/assets/images/codespaces_public_port.jpg)

This makes it easy to run multiple projects in their own Codespaces and have them all talk to each other.  It does seem you may have to make the port public every time you start and stop a service, but I can certainly live with that as it is the only issue I encountered so far.
