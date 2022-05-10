---
layout: blog_post.njk
tags: ['post', 'technology', 'javascript', 'hasura', 'dotnet']
title: A Node.js Developer Tries .NET Again
teaser: I discovered the ASP.NET Minimal APIs.
cover: /assets/images/dotnet_again.webp
date: 2022-05-09
---

I recently wrote a post about frustration I experienced when trying out .NET having worked with Node.js for the past several years. Turns out my Google-fu was off and I should have been searching for "ASP.NET Minimal APIs" which leads to this amazing document : [https://docs.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis?view=aspnetcore-6.0](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis?view=aspnetcore-6.0)

All the fine grained control I am used to is right there! No laborious MVC to wade though, no more butting heads with razor pages, just plain GET and POST requests.

I wanted to see how hard it was to duplicate things I normally do with a simple express API:

1. Can I use url path parameters in GET requests?
2. Can I access the request and response objects?
3. Can I process input from a POST request body?
4. Can I write middleware for requests?
5. Can I do an async web request and return the result within a handler?
6. Can I serve static files?
7. Can I render basic html templates?
8. Can I add a swagger UI?

Yes! The answer to all of the above was yes!  I was shocked.  My experience of trying to get back into .NET had been like someone who normally goes wherever they want on a bicycle suddenly being restricted to traveling by train.  Now I have a bike back!

Here are the details on the items above:

1) Using request path parameters is as simple as adding  {placeholders} to the path.

```C#
app.MapGet("/hello/{name}", (string name) => $"Hello {name}!");
```

2 and 3) Request and response objects are available via a [HttpContext](https://docs.microsoft.com/en-us/dotnet/api/system.web.httpcontext?view=netframework-4.8&viewFallbackFrom=netframework-6.0) binding.  Parsing of JSON body happens automatically via parameter binding.

```C#
app.MapPost("/thing", Thing (HttpContext context, Thing thang) => {
    Console.WriteLine(context.Request.Method);
    return thang;
});
```

4) Middleware looks an awful lot like it does in express.

```C#
app.Use(async (context, next) =>
{
    Console.WriteLine("Halo Fren - I iz Middleware! " + context.Request.Path);
    context.Items.Add("user", "Doge");
    await next.Invoke();
});
```

5) Async HTTP requests within a handler are nice and easy and automatically parse JSON.

```C#
app.MapGet("/proxy", async Task<Todo> (HttpContext context) => {
    Console.WriteLine("Middleware says I am " + (string)context.Items["user"]);
    var client = new HttpClient();
    var todo = await client.GetFromJsonAsync<Todo>("https://jsonplaceholder.typicode.com/todos/1");
    return todo;
}).WithTags("Proxy"); // Sets swagger tag
```

6) Serving static files is a one-liner.

```
app.UseStaticFiles();
```

7) To serve HTML I found the well maintained [Handlebars.NET](https://github.com/Handlebars-Net/Handlebars.Net).

```C#
app.MapGet("/html", async context =>
{
    var source = System.IO.File.ReadAllText(@"./views/demo.html");
    var template = Handlebars.Compile(source);
    var data = new
    {
        title = "Demo Html",
        body = "This is super simple html!"
    };
    var result = template(data);
    await context.Response.WriteAsync(result);
});
```

8) Swagger was also super easy to setup. I did have to re-write several of my handlers to add types for their input parameters and output. I even found how to setup groups (see code for #5 above).  The full swagger setup is in the [demo repo](https://github.com/aaronblondeau/EmptyASP/blob/main/EmptyASP/Program.cs).

Bonus) After getting all this stuff working I noticed that the project template included a dockerfile. The dockerfile built and ran first try which was really fun to see.



