---
layout: blog_post.njk
tags: ['post', 'technology', 'supabase', 'postgres']
title: Postgres RLS Tips
teaser: Learning Postgres RLS with Supabase
cover: /assets/images/nuggets_header.jpg
date: 2024-03-04
---

Does Postgres' [Row Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) make developing apps easier, harder, or just more interesting?

I am working on a [Supabase](https://supabase.com/) project that is going to have a data model that supports content (called nuggets) that can belong to either users individually or to teams.

![](/assets/images/nuggets.png)

Some of the features of this data model are:
- Users aren't required to have a team. They can setup an account and create as many nuggets as they want.
- If a user wants to share nuggets with other users they can:
    - create a team
    - assign nuggets to the team
    - add other users to their team
- There is some room for flexibility in what access team members can have vs what the team owner has.
- If you want to go really crazy you can add a "role" field to the membership table for even more customization.

Most of this was really straightforward to setup with Supabase, but I did learn some things that I want to share

## 1) When using Supabase code that both creates and selects a record, make sure you've setup RLS rules for both:

I had code like this

```JavaScript
const { data: newNugget, error: newNuggetError } = await supabase
.from('nuggets')
.insert({ user_id: userId, content: 'Gold' })
.select()
```

This code kept failing to create the record and it returned null for both data and error. It turns out I had setup a good rule for insert, but had forgotten select. Since there was no rule allowing select I kept getting back an empty result. I had no output to help me figure out what was wrong.

## 2) You can use functions in RLS rules but it gets complicated:

I wanted to have a postgres function called "is_team_member" that I could use in my RLS rules so that they were easy to read:

```SQL
create schema private;

CREATE OR REPLACE FUNCTION private.is_team_member(q_team_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 -- security definer is used to prevent RLS recursion:
 security definer
AS $function$
begin
  return (EXISTS ( SELECT 1
   FROM memberships
  WHERE ((memberships.team_id = q_team_id) AND (memberships.user_id = auth.uid()))));
end;
$function$
;

create policy "Team members can select nuggets that belong to teams they are in"
on "public"."nuggets"
as permissive
for select
to authenticated
using (
   private.is_team_member(team_id)
);
```

This code took several tries to land.

The first way I went wrong was I originally created my function in the public schema. By creating the function in public it became available for anyone to use. My first version also took both team_id and user_id as parameters so that anyone could've used it to leak data about who belonged to which team.

I also ran into recursion issues. is_team_member does a select on the memberships table which requires an RLS check via is_team_member, and so on...

I prevented recursion by adding "security definer" to the function.  Read more about this [here](https://supabase.com/docs/guides/database/postgres/row-level-security#use-security-definer-functions).

I kept the function out of the API by moving it to a private schema.

Any Supabase experts out there see anything else that could go wrong with this approach? I feel like I may have missed something else that could cause this to be insecure.

## 3) raise log to the rescue

Old-school console output based debugging is an underestimated skill. In creating the functions above I found that I could put statements like this into the function to gain some visibility into what was going on:

```
RAISE LOG 'The code got to here!';
```

To view these log messages for [local development with Supabase](https://supabase.com/docs/guides/cli/local-development) you need to find the id of the docker container running postgres. Start with the "docker ps" command:

![](/assets/images/supabase_rls_docker_ps.jpg)

Use the output to pick out the id for the postgres container

Then use the "docker logs" command to see the container's output.  In this example, the exact command I ran was "docker logs 56d13ae4cb94".  "docker logs --follow 56d13ae4cb94" would have also worked as well and kept as stream of the output going.

## 4) Generate migrations

[Supabase's ability to automatically generate migrations](https://supabase.com/docs/guides/cli/managing-environments#auto-schema-diff) helped enormously in developing my RLS rules. I was able to use the local version of supabase studio to rapidly iterate and test my rules. Then once the RLS policies were ready I ran commands like the following to automatically create migrations for me:

```
yarn supabase db diff --schema private -f add_rls_helper_functions
yarn supabase db diff --schema public -f add_rls_policies_for_teams_memberships_nuggets
```

## Summary

I really like the idea of the database itself performing access control for my app. This is a new paradigm for me and the learning curve is a little steeper than I had planned. However, Supabase helps a lot by providing an environment with RLS setup and ready to go.
