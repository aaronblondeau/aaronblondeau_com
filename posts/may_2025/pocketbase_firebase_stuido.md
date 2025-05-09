---
layout: blog_post.njk
tags: ['post', 'technology', 'pocketbase', 'reactnative']
title: PocketBase + Firebase Studio
teaser: Do they play nice together?
date: 2025-05-07
cover: /assets/images/pb_and_fs.png
---

I needed an excuse to try out [Firebase Studio](https://firebase.studio/) so I decided to try and develop a PocketBase backend on it. It didn't work right out of the box, but it was fairly easy to get going.

First, create a Go project in Firebase Studio.  Use "API server" as the environment.

![Screenshot showing selection of environment as "API server"](/assets/images/firebase_studio_pocketbase_1.jpg)

At the time of writing this, the default version of Go in the environment is 1.21, but PocketBase requires 1.23.

![Screenshot showing output of "go version" which indicates go version is 1.21](/assets/images/firebase_studio_pocketbase_2.jpg)

To get a newer version of Go, open up .idx/dev.nix and update the channel to "stable-24.11":

```
channel = "stable-24.11";
```

*I love that they are using [NixOS](https://nixos.org/) for these environments as it will make them very customizable.*

You should be prompted to rebuild the environment once you save this change.

![Screenshot of "Rebuild Environment" button](/assets/images/firebase_studio_pocketbase_3.jpg)

Once the environment restarts, make sure you have Go 1.23+.

![Screenshot showing output of "go version" which indicates go version is now 1.23](/assets/images/firebase_studio_pocketbase_4.jpg)

Your environment will have been setup to run your app via [Air](https://github.com/air-verse/air). You will need to customize Air in order to run PocketBase.

Create an air.toml file by running this command in a terminal window:

```
air init
```

Open the air.toml file and set args_bin to "serve"

```
args_bin = ["serve"]
```

Navigate to the terminal window that is running air.  It will be titled "\[onStart\] run-server"  Use ctrl+c to stop it.

![Screenshot showing the terminal window that is running Air](/assets/images/firebase_studio_pocketbase_5.jpg)

Once the server has stopped, replace the contents of main.go with the code found here : [https://pocketbase.io/docs/go-overview/](https://pocketbase.io/docs/go-overview/)

Then in a terminal window run:

```
go mod tidy
```

In the terminal window that was running air, hit the up key followed by enter to re-run the air command.

![Screenshot showing air re-starting and building PocketBase via main.go](/assets/images/firebase_studio_pocketbase_6.jpg)

You'll notice that the output provides the PocketBase superuser setup url. This url, however, uses http://127.0.0.1:8090 as the host name which you won't have access to.

You'll need to replace the http://127.0.0.1:8090 with your project's public URL. To get this url, first click on the Firebase Studio icon in the left navigation bar. Then expand the "Backend Ports" section.

![Screenshot showing backend ports section. Lock indicates that port 8090 is not yet public.](/assets/images/firebase_studio_pocketbase_7.jpg)

Click on the lock next to port 8090 to make it publicly accessible.

Then open or copy the link from one of the buttons under "actions".

After constructing the admin setup url it will look something like this:

```
https://8090-firebase-pocketbasedemo-1746757209594.cluster-rhptpnrfenhe4qarq36djxjqmg.cloudworkstations.dev/_/#/pbinstal/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc0Njc1OTc0MywiaWQiOiI0MHpjOTU4MHgwbTZjcDIiLCJyZWZyZXNoYWJsZSI6ZmFsc2UsInR5cGUiOiJhdXRoIn0.f7KtQqQ9nVza39RyKi_-QjARkAIq00eooNH3sEW4iak
```

Open the superuser setup url, complete the setup and you'll be up and running with PocketBase!

![Screenshot of the PocketBase superuser setup screen.](/assets/images/firebase_studio_pocketbase_8.jpg)

Note 1 : Your PocketBase admin URL will be whatever you get from the backend ports section followed by a "/_/".  For my environment this was:

```
https://8090-firebase-pocketbasedemo-1746757209594.cluster-rhptpnrfenhe4qarq36djxjqmg.cloudworkstations.dev/_/
```

Note 2 : To run PocketBase manually (with air stopped), you'll use the following command. This helps ensure you're using the same pb_data folder that the server uses when running with air:

```
go run . serve --dir ./tmp/pb_data
```
