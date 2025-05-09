---
layout: blog_post.njk
tags: ['post', 'technology', 'pocketbase', 'reactnative']
title: PocketBase + React Native
teaser: Do they play nice together?
date: 2025-05-08
cover: /assets/images/pb_and_rn.png
---

I have a bit of an obsession with finding the fastest way to launch apps. My goal is to be able to create fully functional MVP's and proofs of concept in less than a day. That means being able to spin up a backend and then implement a frontend as efficiently as possible. For the backend, [PocketBase](https://pocketbase.io/) has been my favorite lately. On the frontend I am still trying to find a winner. I like [Quasar](https://quasar.dev/) (VueJS + Capacitor) which is fantastic for web apps, but falls a bit short for mobile apps. I've been eyeing React Native lately especially since Expo offers a ton of great plugins like [Location](https://docs.expo.dev/versions/latest/sdk/location/) and also supports [remote updates](https://docs.expo.dev/versions/latest/sdk/updates/).

Unfortunately I fell well short of being able to create a basic app in less than a day with these two. After clearing a few roadblocks, however, I think you'll be able to move much quicker than I did on my first attempt.

## Broken File Attachments

Why is there always one critical thing that just doesn't work? For a PocketBase and React Native combo, that one thing is file attachments. The PocketBase SDK docs have some good examples of how you're supposed to be able to attach files to records : [https://pocketbase.io/docs/files-handling/](https://pocketbase.io/docs/files-handling/). This however does not work on React Native on mobile devices (it works fine on web).

The issue has something to do with the way that React Native handles multipart form data on mobile devices. There is also possibly an issue with the way that PocketBase handles the attachments. When using the SDK with React Native, PocketBase will save the record, but then fail to process the attachment. This leaves you with an error on the client side as well as an incomplete record in the database. Double fail.

I felt really smart when I decided to try and bypass the PocketBase SDK and use the REST API via fetch instead, but that didn't work either! Whatever ReactNative does with the networking stack breaks things for fetch as well. So, here is how I wound up getting file attachments to work with an image provided by Expo's [ImagePicker](https://docs.expo.dev/versions/latest/sdk/imagepicker/):

```TypeScript
// iOS doesn't provide fileName
let fileName = image.fileName;
if (!fileName) {
  // Parse filename from image.uri
  fileName = image.uri.split("/").pop();
}

// Prepare a FormData with the record's fields
const postUrl = pocketBaseUrl + "/api/collections/reports/records";
const formData = new FormData();
formData.append("title", title);
formData.append("description", description);
formData.append("user", pb.authStore.record?.id);

// Use custom formatted object for file attachments
formData.append("photos", {
  uri: image.uri, // Do NOT do this here : .replace("file://", ""),
  type: image.mimeType,
  name: fileName,
} as any);

// Post the record to PocketBase's REST API with fetch
const response = await fetch(postUrl, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${pb.authStore.token}`,
  },
  body: formData,
});
const resJson = await response.json();
console.log(resJson);
```

On web I can just do this:

```TypeScript
const data = {
  title: title,
  description: description,
  user: pb.authStore.record?.id,
  // image object provided by ImagePicker has a .file on web
  photos: [image.file]
}
await pb.collection("reports").create(data);
```

The trick on mobile is to set these three fields in the record sent to formData
- uri : Use whatever uri is provided by ImagePicker here - do not replace file://
- type : Use the mime type provided by ImagePicker
- name : Derive a name from either the uri (iOS) or the fileName (Android) provided by ImagePicker

There must be some part of the networking stack in React Native that sees these fields and then loads the referenced file into the HTTP post request. Where to find that documentation is a mystery, but there are quite a few StackOverflows that cover it.

## Broken Realtime

I also had to make a small tweak using the [react-native-sse](https://www.npmjs.com/package/react-native-sse) module to get realtime updates working on mobile. Here is how I use it to init the PocketBase SDK:

```TypeScript
import AsyncStorage from '@react-native-async-storage/async-storage';
import PocketBase, { AsyncAuthStore } from 'pocketbase';
import EventSource from 'react-native-sse';

// SSE Polyfill : https://github.com/pocketbase/pocketbase/discussions/4893
(global as any).EventSource = EventSource;

export const pocketBaseUrl = 'https://path_to_my_pocketbase_instance_running_in_firebase_studio'

const store = new AsyncAuthStore({
  save: async (serialized) => AsyncStorage.setItem('pb_auth', serialized),
  initial: AsyncStorage.getItem('pb_auth'),
  clear: async () => await AsyncStorage.removeItem('pb_auth')
});

export const pb = new PocketBase(pocketBaseUrl, store);
```

## Conclusion

Having waded through these two issues I now have a tech stack that allows for extremely fast app prototyping. However, I do not plan on using this in production anytime soon. Encountering issues like these are warnings that even larger show stoppers are still out there waiting to upend your project.
