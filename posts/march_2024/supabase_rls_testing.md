---
layout: blog_post.njk
tags: ['post', 'technology', 'supabase', 'postgres']
title: Supabase RLS Automated Testing
teaser: We've got all this free time now. Let's use some of it to write better tests.
cover: /assets/images/supabase_rls_qa.jpg
date: 2024-03-15
---

It is no doubt that AI offers a huge productivity boost to coders. That productivity boost, however, comes with some hidden risks. Therefore it is crucial to take advantage of the time savings to write extensive automated tests. I recently came across a perfect example of this while exploring [Supabase](https://supabase.com/) to create an app. This app has a very simple data model:

![](/assets/images/nuggets.png)

In this app users create content called "nuggets".  Users can also create teams to share their nuggets with others. If a nugget has a value in team_id then it is part of team and anyone in the team can view or edit that nugget.

Being new to RLS I got some help from [Codeium](https://codeium.com/) to help write the RLS rules. They all looked very straightforward to me. Take the update rule for example

```SQL
create policy "Users can update nuggets they own or are in their team"
on "public"."nuggets"
as permissive
for update
to authenticated
using (
   (user_id = auth.uid())
   OR (private.is_team_member(team_id))
);
```

At a first glance this all looks ok:
- If my user_id matches the id of the nugget then it is my nugget and I of course can edit it.
- If the nugget is in a team and I am a member of the team then I can also edit it.

**Unfortunately this rule has a security bug! Can you spot it?** I sure couldn't and am so thankful that I wrote automated tests to make sure my RLS rules were doing the right thing.

## Playwright to the Rescue

I created a really simple rig to test my RLS rules. I began by following [Playwright's getting started guide](https://playwright.dev/docs/intro).

Then I added a command to my package.json to help me run the tests (and run them in only one browser):

```
"test:e2e": "playwright test --project=chromium"
```

Writing tests was easy and quite a bit of fun. Each test drives the [Supabase Javascript client library](https://supabase.com/docs/reference/javascript/introduction) in the playwright browser and look like this:

```Javascript
import { test, expect } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'

// Create user and admin clients for interacting with your local dev database
const supabase = createClient('http://localhost:54321', 'TEMPORARY DEV ENV ANON TOKEN HERE - DO NOT USE PROD TOKEN')
const supabaseAdmin = createClient('http://localhost:54321', 'TEMPORARY DEV ENV ADMIN TOKEN HERE - DO NOT USE PROD TOKEN')

test.beforeEach(async ({ page }) => {
  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()

  // Note: we depend on db cascades to cleanup all test user's data!
  // If the local test database get polluted, run : yarn supabase db reset 

  // Ensure supabase is logged out
  await supabase.auth.signOut()

  // Cleanup data from previous test runs by removing test users
  for (const user of users) {
    if (user.email?.includes('permissions-team-test.com')) {
      console.warn('~~ removing test user', user.id)
      await supabaseAdmin.auth.admin.deleteUser(user.id)
    }
  }
})

test.describe('Team RLS', () => {
  test('a user can create and delete a team', async ({ page }) => {

    // Create user for the test
    const { data: registerData, error: registerError } = await supabase.auth.signUp({
      email: 'test1@permissions-team-test.com',
      password: 'foobart1',
    })
    expect(registerError).toBeNull()
    expect(registerData.user).toBeDefined()

    // Create team
    const { data: teamId, error: createTeamError } = await supabase.rpc('create_team', { team_name: 'Test Team 1!' })
    expect(createTeamError).toBeNull()

    // Fetch team
    const { data: teamData } = await supabase
    .from('teams')
    .select('*')
    .eq('id', teamId)
    expect((teamData as any)[0].name).toBe('Test Team 1!')

    // Make sure user has membership for team
    const { data: memberships, error: membershipsError } = await supabase
    .from('memberships')
    .select('*')
    expect(membershipsError).toBeNull()
    expect((memberships as any).length).toBe(1)

    // Delete team
    const { error: deleteTeamError } = await supabase
    .from('teams')
    .delete()
    .eq('id', teamId)
    expect(deleteTeamError).toBeNull()

    // Make sure team is gone
    const { data: teams, error: teamsError } = await supabase
    .from('teams')
    .select()
    .eq('id', teamId)
    expect(teamsError).toBeNull()
    expect((teams as any).length).toBe(0)
  })
  // ... more tests here
})
```

These tests also serve as a great pool of example code to use while developing my app's frontend!

## The Security Bug

When writing tests for the update rules for the nuggets table I remembered something I read in the [Designing Secure Software](https://www.amazon.com/gp/product/1718501927/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1) book - hackers will sometimes try to inject content into other user's teams. In the case of my faulty RLS rule above, if I know the id of a team in the application I can add my nuggets to it simply by setting team_id. I don't even have to be a member of the team! Storing team_id on the nugget model probably isn't a good choice, but I can also fix this simply by adjusting the RLS rule:

```SQL
create policy "Users can update nuggets they own or are in their team"
on "public"."nuggets"
as permissive
for update
to authenticated
using (
   ((team_id IS NULL) AND (user_id = auth.uid()))
   OR (private.is_team_member(team_id))
);
```

Now users have to be a member of the team!

So, the moral of the story is **write tests** - you'll never regret it!
