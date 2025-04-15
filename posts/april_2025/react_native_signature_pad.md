---
layout: blog_post.njk
tags: ['post', 'technology', 'react']
title: How to create custom webview based React Native components
teaser: You just can't escape webview!
cover: /assets/images/react_native_signature_pad.jpg
date: 2025-04-14
---

I am currently working on porting a capacitor app to React Native (Expo). One of the components I need to re-create is a signature area. Unfortunately the existing components for this are pretty terrible so I decided to create my own. It turned out to be so fairly easy and I think having my own component will ultimately save me time.

The code is here : [https://github.com/aaronblondeau/react-native-signature-pad](https://github.com/aaronblondeau/react-native-signature-pad)

## Simple Usage

First install signature_pad from npm:

```
npm add signature_pad
```

Then add expo-filesystem and expo-asset to your project so that HTML can be loaded for the webview:

expo-filesystem : https://docs.expo.dev/versions/latest/sdk/filesystem/
expo-asset : https://docs.expo.dev/versions/latest/sdk/asset/

Copy [assets/signature_pad.html](https://github.com/aaronblondeau/react-native-signature-pad/blob/main/assets/signature_pad.html) to the assets folder of your project.

Copy [components/MobileSignaturePad.tsx](https://github.com/aaronblondeau/react-native-signature-pad/blob/main/components/MobileSignaturePad.tsx) to the components folder of your project.

Copy [components/WebSignaturePad.tsx](https://github.com/aaronblondeau/react-native-signature-pad/blob/main/components/WebSignaturePad.tsx) to the components folder of your project.

Copy [components/SignaturePad.tsx](https://github.com/aaronblondeau/react-native-signature-pad/blob/main/components/WebSignaturePad.tsx) to the components folder of your project.

Finally, use the SignaturePad component in your project.  See [app/index.tsx](https://github.com/aaronblondeau/react-native-signature-pad/blob/main/app/index.tsx) for example usage.

## Customizable Usage

Follow the steps above. Then copy the [webview/react-native-signature-pad](https://github.com/aaronblondeau/react-native-signature-pad/tree/main/webview/react-signature-pad) folder into your project.

Inside of the webview/react-signature-pad folder run 

```
npm install
```

You can also run the webview code with vite

```
npm run dev
```

To update the html used in the react native project (/assets/signature_pad.html) run:

```
npm run build
```

## Project Structure

The project is setup to provide support for Android, iOS and Web. When used on iOS and Android a [WebView](react-native-webview) is used to render a single file HTML page containing a web app that implements the signature pad. When the React Native code is used on the web, the React component that implements the signature pad is used directly.

![Diagram showing relationship between components](/assets/images/react_native_webview_components.png)

## Implementing the web component

Here is how I created the custom signature pad component:

First I added a "webview" folder to the top level of my react native project.

```
mkdir webview
```

Then I started a react (regular react, not react-native) project with vite inside of the webview folder.

```
cd webview
npm create vite@latest
```

I chose "react-signature-pad" as the name, React as the framework, and TypeScript as the variant.

Why vite? My end goal was for the web content to be a single html file (via [vite-plugin-singlefile](https://www.npmjs.com/package/vite-plugin-singlefile)) that is easy to embed in the react native application.

After doing some cleanup I implemented the component as a standalone web app using [signature_pad](https://www.npmjs.com/package/signature_pad) from npm.

The [App.tsx](https://github.com/aaronblondeau/react-native-signature-pad/blob/main/webview/react-signature-pad/src/App.tsx) file contains all the code to send data and events back and forth between the web application and the react native application. It does this by adding some methods to the global namespace so that they can be called via React Native webview's [injectJavaScript](https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md#communicating-between-js-and-native). Events and data are then sent back up to the webview by calling window.ReactNativeWebView.postMessage().

Note that you cannot return values from injectJavaScript calls. So if you need to get data from inside of the webview you need to call a method that then postMessage's the data you need. In order to get the PNG image data for the signature, the code first uses injectJavaScript to call a method called "emitSignatureData".  emitSignatureData then calls signature_pad's toDataURL to get the data and sends it back with postMessage.

![Diagram showing data flow between react native and web content in a webview component](/assets/images/react_native_webview_data_flow.png)

[WebSignaturePad.tsx](https://github.com/aaronblondeau/react-native-signature-pad/blob/main/components/WebSignaturePad.tsx) does the work of creating a canvas and setting up signature_pad. WebSignaturePad provides a few events via props and some methods via [forwardRef](https://react.dev/reference/react/forwardRef) and [useImperativeHandle](https://react.dev/reference/react/useImperativeHandle).

*Quick react rant...  What in the hell is useImperativeHandle supposed to mean? Whoever is in charge of naming things badly on the react team needs to stop being a smartass and/or go find something else to work on. I avoided using react for years because I thought "useEffect" was so stupid. Rant complete...*

Note that I used the deprecated version of forwardRef because Expo isn't fully up to date with React 19 yet.

Also note that I wound up moving the WebSignaturePad.tsx component to the main react-native project in order to resolve some TypeScript errors.

## Packaging the web component

There are some limitations when it comes to using webviews. The main one being that it cannot load local html files. If your content is super simple you can just use an html string. If your content is complex the webview component docs recommend you implement a [local webserver](https://github.com/react-native-webview/react-native-webview/blob/1ddfe70521725c365cf8accf2a1bdf82eb4db80f/docs/Guide.md#loading-local-html-files).

Since using a local webserver seems like a bad idea. I decided to leverage vite to package the entire web app into a single file. 

First I setup vite-plugin-singlefile

```
npm install vite-plugin-singlefile --save-dev
```

I used instructions from the module's npm page, but used "react()"" instead of "vue()"

I also tweaked vite.config.ts to make output go to ../assets/signature_pad.html instead of dist/index.html

My final vite.config.ts is [here](https://github.com/aaronblondeau/react-native-signature-pad/blob/main/webview/react-signature-pad/vite.config.ts).

This setup is really nice because I can run npm build in the webview source:

```
cd webview/react-signature-pad
npm run build
```

This deploys the single signature_pad.html file needed for the webview.

Note that I didn't have to do anything special to get react native to load the .html file into a string for use with the webview.  There are some instructions [here](https://dev.to/somidad/read-text-asset-file-in-expo-356a) that may be helpful if it doesn't work out of the box for you.

## Final Thoughts

Should I move this into an npm package or is it more useful as just example code?
