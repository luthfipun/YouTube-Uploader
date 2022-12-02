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
    const chromiumPath = ''
    // for mac
    // /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
    // for ubuntu
    // /usr/bin/chromium-browser

    const youtubeUploader = new YoutubeUploader(chromiumPath)

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
