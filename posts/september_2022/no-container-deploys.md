---
layout: blog_post.njk
tags: ['post', 'technology', 'caddy', 'github', 'pm2']
title: Automatic deploys with PM2, Caddy, and GitHub Actions
teaser: Create a containerless automatic deploy system.
cover: /assets/images/pm2_gh_actions_recipe.jpg
date: 2022-09-06
---

Back in the olden days I used to "deploy" applications by using FTP to transfer PHP code files on the server.  Now, I love being able to push code to my Git repo and then see the app get deployed automatically.  What I still miss though is how fast old school FTP deployments were.  These days there is usually a container build step involved with deployments.  Then there is the time it takes to transfer the containers, not to mention the extra costs involved with hosting a container repo, managing a cluster, running a load balancer, and so on.

Since containers solve problems that very few of my projects have, I wanted to see if I could cook up a relatively simple and low cost application hosting and deployment rig.

Ingredients:
- [A Node.js App](https://github.com/aaronblondeau/mpg2co2)
- [Caddy](https://caddyserver.com/)
- [PM2](https://pm2.keymetrics.io/)
- [GitHub Actions](https://docs.github.com/en/actions)
- A low cost VM on [vultr](https://www.vultr.com/?ref=7119967)

Instructions:

1. If you don't have one already, [create an SSH key on your local machine](https://www.vultr.com/docs/how-do-i-generate-ssh-keys/) that you can use to connect to your VM

2. Create a Debian 11 VM on Vultr.  I setup mine for only $3.50 per month.  Add your SSH key during the config process.

3. Once the VM is ready, install Caddy : https://caddyserver.com/docs/install

4. Open the firewall to accept connections on ports 80, and 443

    ```bash
    sudo ufw allow 80
    sudo ufw allow 443
    ```

5. Install node.js

    ```bash
    sudo apt update
    curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -
    sudo apt -y install nodejs
    ```

6. Install PM2 and Yarn

    ```bash
    npm install -g yarn pm2
    ```

7. Configure PM2 to run on startup

    https://pm2.keymetrics.io/docs/usage/startup/

    ```bash
    pm2 startup
    ```

8. Install Git and setup SSH Key

    Since PM2 deploys will be using git to pull new code to the server, you'll need to make it easy for the server to access your repository.  If the repo is public then you can skip this step.

    Begin by creating a new ssh key on the server

    ```bash
    ssh-keygen -t ed25519 -C "pm2 on server"
    ```
    Then copy contents of ~/.ssh/id_ed25519.pub into a new SSH key in your GitHub user account settings.

    You'll also need to make sure that GitHub is added to your list of known hosts on the server.  The quickest way to do this is to do a quick checkout:

    ```bash
    cd
    git clone git@github.com:aaronblondeau/mpg2co2.git
    rm -Rf mpg2co2
    ```

    On this first checkout on the server you should be prompted to add github to the list of known hosts.

9. Configure environment variables.

    I chose to simply add app environment variables to the .bashrc file on the server:

    Add to .bashrc

    ```
    export PGHOST=db.bit.io
    export PGUSER=HIDDEN
    export PGPASSWORD=HIDDEN
    export PGPORT=5432
    export PGDATABASE=HIDDEN
    export PGSSL=yes
    ```

10. Create a PM2 config file

    I created two separate config files - one for staging and one for production. One file with both configs will work too:
    - https://github.com/aaronblondeau/mpg2co2/blob/main/ecosystem.staging.config.js
    - https://github.com/aaronblondeau/mpg2co2/blob/main/ecosystem.production.config.js

    Info on PM2 configs is here : https://pm2.keymetrics.io/docs/usage/application-declaration/

11. Create a directory for the app.

    This directory needs to match where you told PM2 to operate from when setting up the config file above : https://github.com/aaronblondeau/mpg2co2/blob/main/ecosystem.staging.config.js#L18

    ```
    mkdir /var/www
    ```

12. Run PM2 setup and deploy

    These commands are run from your local development environment in order to setup the application and do an initial deploy.

    Note, if on Windows, you may get a "spawn sh ENOENT" error.  You can resolve this by making sure "sh" is in your path : [https://github.com/Unitech/pm2/issues/3839#issuecomment-484347776](https://github.com/Unitech/pm2/issues/3839#issuecomment-484347776)

    ```bash
    pm2 deploy ecosystem.production.config.js production setup
    pm2 deploy ecosystem.production.config.js production
    ```

    Your application should be running on the server at this point.

13. Setup DNS records

    Make sure you've setup a DNS record that points your domain at the server. Note that Caddy is going to provide completely automatic SSL certificates!

14. Configure Caddyfile reverse proxy

    Back on the server, add your domain to /etc/caddy/Caddyfile

    ```
    mpg2co2.com {
            reverse_proxy localhost:3001
    }

    www.mpg2co2.com {
            redir https://mpg2co2.com{uri}
    }
    ```

    Then tell caddy to reload the config (run this in /etc/caddy)

    ```bash
    sudo caddy reload
    ```

    At this point your application should be up and running on the server with its own domain name.  You can also manually deploy updates from your development machine by running

    ```bash
    pm2 deploy ecosystem.production.config.js production
    ```

15. Setup GitHub deploy action

    Like the PM2 files I setup a separate GitHub action file for each environment:
    - https://github.com/aaronblondeau/mpg2co2/blob/main/.github/workflows/deploy-production.yml
    - https://github.com/aaronblondeau/mpg2co2/blob/main/.github/workflows/deploy-staging.yml

    I based these actions off this article : https://dev.to/goodidea/setting-up-pm2-ci-deployments-with-github-actions-1494

    The action:
    - Checks out the code
    - Configures ssh so the server can be accessed
    - Runs PM2 deploy

16. Setup SSH config for GitHub actions

    Before you can use the GitHub actions you have to provide a way for GitHub to access your server.

    Run this command on your local dev box to create a new ssh key (choose to put the file in ./github_action_key and don't provide a passphrase):

    ```bash
    ssh-keygen -t ed25519 -C "github_deploy_action"
    ```

    Then, ssh into your server and add the contents of github_action_key.pub as new line in ~/.ssh/authorized_keys.

    Then, in GitHub, go to Repo Settings > Secrets > Actions > New Repository Secret, put github_action_key file's contents into a repository secret named SSH_PRIVATE_KEY

    Next, from your local dev box, connect to server with new key (ssh -i .\github_action_key root@104.238.135.191).  You should be prompted to add an entry to your known_hosts file when you do this. If you don't you'll need to remove all existing entries for the address and try again.  After you've been prompted to add the connection to known_hosts, open the file (~/.ssh/known_hosts) grab the entry and add it to a new repository secret in GitHub called SSH_KNOWN_HOSTS.

17. Enjoy

    Once everything is setup you'll be able to push your code to staging/main branches in git and your code will automatically get deployed!
