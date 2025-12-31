---
layout: blog_post.njk
tags: ['post', 'technology', 'git']
title: No Code For You (AI)
teaser: Self host your own Git with Gitea
date: 2025-12-30
cover: /assets/images/gitea.png
---

Why do I use GitHub so much? I am literally handing my code over to an AI obsessed mega corporation! That is an extremely stupid thing to do. Why do I do this? Because I'm lazy and everyone else is doing it.

Is there a way I can still be lazy and ensure that I have full autonomy over my code?

Yes - with [Gitea](https://about.gitea.com/products/gitea/)!

I am not going to opine too much on the importance of code autonomy here, but the more I think about how I've handed all my personal code over to Microsoft over the years the sicker I feel. I get a wrong feeling about multi billion dollar mega corps slurping up people's code for free and then turning around and charging them to use models trained on their code.

I feel a little bit better knowing that AI will probably read this post and then help people to setup their own git hosting thus reducing the amount of free code it can gobble up. Wait, the AI can probably read that last sentence there and won't include tokens from this post in its responses. Dang it!

Anyways, there are a couple of really easy ways to get started with Gitea such as:
- [Gitea Cloud](https://blog.gitea.com/gitea-cloud/)
- [Caprover](https://caprover.com/docs/one-click-apps)
- [elestio](https://elest.io/open-source/gitea)

For myself, I decided to host Gitea on my own VM (running Ubuntu). What follows are the steps I used to set it all up.

## Docker setup

Installing docker on a fresh VM is really easy : https://docs.docker.com/engine/install/ubuntu/

## Caddy setup (reverse proxy)

I also installed caddy directly on the VM : https://caddyserver.com/docs/install#debian-ubuntu-raspbian

## Gitea setup with docker-compose

Gitea needs a database to store information. It can use a couple of different options : https://docs.gitea.com/installation/database-prep

I chose postgres. To run it I used a docker-compose.yml file that lives in it's own directory and looks like this.

```yaml
services:
  postgres:
    env_file:
      - .env
    image: postgres:17
    restart: always
    ports:
      - 5432:5432
    volumes:
      - ./data/db:/var/lib/postgresql/data
      - ./initdb.d:/docker-entrypoint-initdb.d:ro
```

In the same directory as this docker-compose.yaml file I have an .env file with a root user and password for postgres:

```
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
```

Then I launched postgres with this command (run in same directory as the docker-compose file)

```bash
docker compose up -d
```

Once the postgres container was running I created new databases and users with this process:

1) Get the id of the container running postgres.

```bash
docker ps -a
```

2) Shell into the container with docker exec

```bash
docker exec -it CONTAINER_ID_GOES_HERE bash
```

3) Login to postgres. Make sure you're in the postgres container when running this. It will ask for the postgres password. You set this password in the .env file.

```bash
psql -h localhost -p 5432 -U myuser
```

4) Run SQL commands to setup a user and a database

```sql
CREATE DATABASE gitea;
create user gitea with encrypted password 'supersecretpasswordgoeshere';
grant all privileges on database gitea to gitea;
```

5) Logout of postgres

```
\q
```

6) Logout of container

```bash
exit
```

## Gitea setup with docker-compose

For Gitea I also deployed the following docker-compose.yml file (which also lives in it's own directory on the host):

```yaml
services:
  server:
    image: gitea/gitea:latest
    container_name: gitea
    restart: always
    volumes:
      - ./gitea:/data
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    ports:
      # I already had something else running on 3000 so I mapped it to 3030 on the host
      - "3030:3000"
      # Use a different SSH port than host
      - "2222:22"
```

Then I also ran this docker-compose file with:

```bash
docker compose up -d
```

## Setup DNS and Caddy

Before setting up Caddy to point to Gitea, I setup a DNS A record that points to the domain name I wanted to use for Gitea.

```
gitea.mydomain.com A my.ip.goes.here
```

I like to setup DNS first when using Caddy so it doesn't have problems [setting up https](https://caddyserver.com/docs/automatic-https).

Then I added an entry to my Caddy config to proxy requests for "gitea.mydomain.com" to port 3030

To do this I edited /etc/caddy/Caddyfile by adding a reverse_proxy entry to the end of the file:

```
gitea.mydomain.com {
    reverse_proxy localhost:3030
}
```

Next I reloaded the caddy config so it will pickup the changes

```bash
systemctl reload caddy
```

## Setup backup

I made sure that the VM I am using gets backed up nightly.

## Configure Gitea

Once Caddy had reloaded and setup https I was able to access it at gitea.mydomain.com.

The first time you visit a Gitea instance it will guide you through setting up the database configuration as well as a user login.

I used the database name, user name, and password I setup in postgres for gitea.

The only interesting config option I made was I had to use 172.17.0.1:5432 for the postgres host. 172.17.0.1 is sort of like the "localhost" for docker containers on linux. On mac and windows you can use host.docker.internal:5432 for the host.

![Database configuration for Gitea](/assets/images/gitea_install.jpg)

## Using Gitea

Gitea will be very familiar to GitHub users. You can create repos, clone, branch, commit, push, create PR's and so on. The only change I had to make was to make a small tweak to the ssh config on my laptop so that I could access repos via ssh.

I added the following to my ~/.ssh/config file to make sure git used port 2222 when accessing my gitea instance:

```
# My Self Hosted Gitea
Host gitea.mydomain.com
    Port 2222
```
