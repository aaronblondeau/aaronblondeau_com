---
layout: blog_post.njk
tags: ['post', 'technology', 'ai', 'python', 'llama']
title: Creating a Llama 2 Agent
teaser: Learning how AI agency works
cover: /assets/images/llama_lights.jpg
date: 2023-08-16
---

I don't think that people are going to be content simply chatting with AIs. We are going to want them to do things for us. Or maybe we don't want that. Should we give AI access to the outside world? I wanted to learn how AI agency (empowering AI to complete tasks) works in order to examine the issue some more and to decide how worried I should be.

The main restriction with current AI large language models is that they are text in, text out. You're basically giving the model some text and it is figuring out what the next most probable word is until it has formed a response. Although AI models are very good at generating code, the model itself (unless it secretly knows how to overflow memory) shouldn't be able to run anything in order to take actions in the real world.

So, how do we empower an AI to be able to do useful tasks for us? There are two approaches that come to mind:

1) Ask the AI to output some code, and then evaluate that code.

```
User: Please write some Python to help me clean up my computer.
Assistant :
import os
os.unlink('/')
```

Ok, that could actually be a huge problem. I bet plenty of people out there are doing things like this and am surprised I haven't seen any news stories about chaos caused this way.

2) Ask the AI to output JSON formatted responses that we can parse and respond to.

The conversation would look like this:

```
User: Can you make my room lighting orange please?
Assistant: {"action": "set_room_color", "action_input": "#FFA500"}
```

Here is how I built a Jupyter notebook (Python) that uses Llama 2 to make this happen locally on my computer.

Note that I chose Llama 2 because I am able to run it locally on my own machine without racking up all kinds of API fees on OpenAI. Plus it is definitely smarter than an actual Llama.

First I created a folder for my project and setup a Python virtual environment:

```
python -m venv ./wenv
.\wenv\Scripts\activate.ps1
```

or, if you're on mac/linux

```
python3 -m venv ./venv
source ./venv/bin/activate
```

Then I imported some dependencies:

```
pip install notebook
pip install llama-cpp-python
```

Next, I launched jupyter locally with:

```
jupyter notebook --ip=0.0.0.0 --allow-root --NotebookApp.allow_origin="*"
```

Then in my jupyter notebook, I did my imports.  Note that this code just displays colored squares instead of actually changing lights in my house.

```
from llama_cpp import Llama
import re
import json
from IPython.core.display import display, HTML
```

Next, I loaded the model:

```
# Create the model using Llama 2 7b chat (runs on CPU)
# My .bin was downloaded from here : https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGML
# but they can come from here too? : https://ai.meta.com/llama/
llm = Llama(model_path="./llama-2-7b-chat.ggmlv3.q8_0.bin")
```

Then a quick test to make sure the model was working:

```
llm("What are the days of the week in order?")
```

Next is where the bulk of my work happened. Prompt engineering is kind of like a new form of programming. Until I started on this project I had no idea about system prompts. System prompts happen behind the scenes in a chat to help set the context for the model so that it knows how to respond. Because I am using Llama 2 I had to find how to format a prompt to include a system prompt. My system prompt had to that convince the model to output well formatted JSON in it's response. In addition to a task description I also used a technique called "few-shot" prompting that includes some examples for the model to follow. Here is what I came up with.

```
# create an prompt template that uses an engineered system_prompt

# Based on:
# https://www.pinecone.io/learn/llama-2/
# and
# https://docs.langchain.com/docs/components/agents

prompt_template = '''<s>[INST] <<SYS>>
Assistant is a expert JSON builder designed to assist with a wide range of tasks.

Assistant is able to trigger actions for User by responding with JSON strings that contain "action" and "action_input" parameters.

Actions available to Assistant are:

- "set_room_color": Useful for when Assistant is asked to set the color of User's lighting.
  - To use the set_room_color tool, Assistant should respond like so:
    {{"action": "set_room_color", "action_input": "#FF0000"}}

Here are some previous conversations between the Assistant and User:

User: Hey how are you today?
Assistant: I'm good thanks, how are you?
User: Can you set the color of my room to be red?
Assistant: {{"action": "set_room_color", "action_input": "#FF0000"}}
User: That looks great, but can you set room color to green instead?
Assistant: {{"action": "set_room_color", "action_input": "#00FF00"}}
User: Maybe my room would look better if the color was blue.
Assistant: {{"action": "set_room_color", "action_input": "#0000FF"}}
User: Please set my room lighting to the color of a tree.
Assistant: {{"action": "set_room_color", "action_input": "#31D45B"}}
User: Thanks, Bye!
Assistant: See you later.
<</SYS>>

{0}[/INST]'''
```

Next I defined the power that I want to give my AI - the ability to change lighting color in my house. However, to make this notebook useful for everyone, this example just creates a colored square in the notebook.

```
def set_room_color(hex):
    # We would make a call to our smart-home API here, instead just drawing a colored square
    display(HTML('<div style="width: 100px; height: 100px; background-color: ' + hex + '"></div>'))
```

The following function serves as a chat "proxy" between the user and the AI. It sends the user's message to the model, then looks for command actions in the response. If a command response is found, the appropriate function is called.

```
def process_command(command):
    # Put user command into prompt (in future projects we'll be re-injecting whole chat history here)
    prompt = prompt_template.format("User: " + command)
    # Send command to the model
    output = llm(prompt, stop=["User:"])
    response = output['choices'][0]['text']

    # try to find json in the response
    try:
        # Extract json from model response by finding first and last brackets {}
        firstBracketIndex = response.index("{")
        lastBracketIndex = len(response) - response[::-1].index("}")
        jsonString = response[firstBracketIndex:lastBracketIndex]
        responseJson = json.loads(jsonString)
        if responseJson['action'] == 'set_room_color':
            set_room_color(responseJson['action_input'])
            return 'Room color set to ' + responseJson['action_input'] + '.' 
    except Exception as e:
        print(e)
    # No json match, just return response
    return response
```

My first command worked perfectly!

```
process_command("Can you make my room lighting orange please?")
```

Non-command prompts work too:

```
process_command("What is your name?")
```

And a more complex request:

```
process_command("Please set the lights to a happy color.")
```

I did experiment a lot with [LangChain](https://docs.langchain.com/docs/) but had an extremely hard time getting anything to work, especially with a non-OpenAI model like Llama. My problems with LangChain forced me to dig into how things really work and I was surprised how clean and simple it can be to implement cool solutions with just a LLM and some plain Python.

See the whole notebook here : [https://gist.github.com/aaronblondeau/52355a51275f5ef62766a30c9884035f](https://gist.github.com/aaronblondeau/52355a51275f5ef62766a30c9884035f)
