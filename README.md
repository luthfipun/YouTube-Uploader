# YouTube Uploader

YouTube Upload is a program that will automatically upload video to YouTube

## Installation
```shell
npm i @luthfipun/yt-uploader puppeteer
```
or
```shell
yarn add @luthfipun/yt-uploader puppeteer
```

## Usages

```js
const YoutubeUploader = require('@luthfipun/yt-uploader')
//or es6
import { YoutubeUploader } from "@luthfipun/yt-uploader";

try {
    const chromiumPath = YoutubeUploader.CHROMIUM_MAC_PATH
    // for ubuntu
    // YoutubeUploader.CHROMIUM_MAC_PATH

    const youtubeUploader = new YoutubeUploader(chromiumPath, DISPLAY_FOR_UBUNTU)

    // optional display parameters for ubuntu, usually is ":10.0"

    await youtubeUploader.Login(YOUR_EMAIL, YOUR_PASSWORD)
    console.log('LoggedIn to your account')

    console.log('Uploading ...')
    await youtubeUploader.UploadVideo(
        VIDEO_PATH,
        VIDEO_TITLE,
        VIDEO_DESCRIPTION,
        VIDEO_THUMBNAIL,
        VIDEO_TAGS // sample : #test, #videotest, #testing,
    )

    console.log('Uploading successfully')
    await youtubeUploader.CloseBrowser()
}catch (e) {
    console.log(e)
}
```
