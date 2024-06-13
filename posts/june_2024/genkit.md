---
layout: blog_post.njk
tags: ['post', 'technology', 'ai']
title: Simple AI Smart Home Manager
teaser: Testing out the Firebase Genkit project
date: 2024-06-12
cover: /assets/images/genkit.jpg
---

The code for this post is all available here : [https://github.com/aaronblondeau/genkit-smarthome](https://github.com/aaronblondeau/genkit-smarthome)

View the working app at [https://smarthome.aaronblondeau.com/](https://smarthome.aaronblondeau.com/)

Although I am working to de-google my life, I took note of the recent launch of [Firebase Genkit](https://firebase.google.com/docs/genkit/). I have struggled to get tools like [LangChain](https://www.langchain.com/) to perform well when working with structured data. Since the ability to ingest and output JSON is crucial for AI applications I decided to give Genkit a try. Genkit exceeded my expectations and is now a member of my tech toolbox.

Here is the scenario I used to test Genkit. Imagine you have both a smart-thermostat and a smart-light in your office and you'd like to be able to control them with natural language commands. For example, "Set the lights to green please." or "Set the temperature to eighty please."

For this to work the language model needs a few things:
1) Prompts that specify the desired outcome.
2) A list of the high level actions that can be taken.
3) Tools that help extract formatted data from the user's request (for example, turn "eighty" into 80 so it can be used by the thermostat device).

And I as a developer working on the app have these needs:
1) Ability to test and quickly iterate on each prompt.
2) Detailed output of the chain of prompts and responses that result in fulfillment of a user's request.
3) Ability to use multiple models (even those running locally like ollama).
4) **Reliable structured data output from the llm.**

Genkit does an excellent job of filling these needs. For the developer it provides a UI that helps you to run prompts as well as analyze the inputs/outputs of each step in a multi-prompt workflow. Here is a screenshot of my Genkit UI instance showing all my flows.

![Screenshot of Genkit UI](/assets/images/genkit_ui_a.png)

There also appears to be support for non-google models : [https://github.com/TheFireCo/genkit-plugins/tree/main](https://github.com/TheFireCo/genkit-plugins/tree/main)

For the language models, Genkit provides the concept of [Flows](https://firebase.google.com/docs/genkit/flows). A flow basically combines a prompt with a set of "tools" or actions that the llm can take. Like other frameworks in this space [ZOD](https://zod.dev/) is used to provide schema information for both the input and output of flows and actions.

For example here is the code for my **flow** that sets the color of lights in a room.  It has a prompt that helps set the context of what needs to be done. It also has a set of tools it can use : extractColor, convertColorToHex, setLEDColor

```JavaScript
// Primary level flow for setting the room's lighting.
export const setLightsFlow = defineFlow(
  {
    name: 'setLightsFlow',
    inputSchema: z.object({
      command: z.string().describe('The user\'s request for a lighting color change.')
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    const llmResponse = await generate({
      prompt: `Please respond to this command to set the color of lights in the room : ${input.command}`,
      model: geminiPro,
      tools: [extractColor, convertColorToHex, setLEDColor],
      config: standardConfig,
    });
    return llmResponse.text();
  }
);
```

And here is code for an **action** that the model can use to convert color names to hex codes. The really neat thing here is that you can embed a flow within an action.

```JavaScript
// Provides the convertColorToHexFlow as a tool
export const convertColorToHex = action(
  {
    name: 'convertColorToHex',
    description: 'Converts a color string to hex. For example, an input of "blue" outputs "0000FF"',
    inputSchema: z.object({ colorString: z.string() }),
    outputSchema: z.object({ hexColorCode: z.string().length(6) }),
  },
  async (input) => {
    const response = await runFlow(convertColorToHexFlow, {
      color: input.colorString
    });
    return response
  }
);
```

A simpler **action** that takes concrete action on behalf of the user:

```JavaScript
// Low level tool that sets the color of the room's lights
export const setLEDColor = action(
  {
    name: 'setLEDColor',
    description: 'Sets the color of the room\'s lighting by sending commands to the fixture\'s bluetooth API.',
    inputSchema: z.object({ hexColorCode: z.string().length(6) }),
    outputSchema: z.boolean().describe('True if the color is successfully set.'),
  },
  async (input) => {
    homeActor.send({ type: 'SETCOLOR', value: input.hexColorCode })
    return true
  }
);
```

homeActor is an [XState](https://stately.ai/docs/xstate) finite state machine. I really like the idea of providing AI models with a state machine that they can manipulate to get to the user's desired outcome. My state machine doesn't do much in this example but I feel like genkit+xstate is a really powerful combo that I am going to explore further.

I won't go into all the other implementation details here, but here are the 3 most important things I learned in getting the project to work:

### 1) Provide a tiered structure of flows and actions

Genkit automatically runs multiple tools in the right order when they are needed to execute a command. However I got quite a few errors when I attempted to have the same flow responsible for multiple jobs. I wound implementing a pattern where the first flow simply determines what type of command the user gave (lights vs thermostat). That high level flow can defer to a tool for each type of command. These tools in turn execute a sub-flow that is job specific. Here is what it looks like:

![Diagram of flows/actions](/assets/images/genkit-smarthome-workflow.png)

### 2) Avoid system prompts

The Genkit docs detail how to use system prompts here : https://firebase.google.com/docs/genkit/models

As I am accustomed to using system prompts to give context to the llm I tried them first. However, gemini would return a response of "Understood" from each system prompt which threw off the chain of execution. So I stopped using system prompts and put all my context into each flow's main prompt. Other models are likely to behave differently.

### 3) Avoid simple string schemas for inputs and outputs

Most of my actions and flows simply return a single piece of data like "blue" so I originally setup my flows like this:

```JavaScript
{
  name: 'convertColorToHexFlow',
  inputSchema: z.string(),
  outputSchema: z.string().length(6),
}
```

This flat schema resulted in flows providing a value of {} as input to tools. That issue went away when I made the schemas more descriptive like this:

```JavaScript
{
  name: 'convertColorToHexFlow',
  inputSchema: z.object({
    color: z.string()
  }),
  outputSchema: z.object({
    hexColorCode: z.string().length(6)
  }),
}
```

### Summary

Give Genkit a try. It is a minimal framework that will help you manage all the chaos that comes from being proompter.

Thanks for reading!
