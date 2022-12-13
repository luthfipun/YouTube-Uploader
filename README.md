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
const { YoutubeUploader } = require('@luthfipun/yt-uploader');
const { CHROMIUM_MAC_PATH, UPLOAD_PRIVACY_PUBLIC } = require("@luthfipun/yt-uploader/dist/helpers/youtubeUploaderOptions");
//or modules
import { YoutubeUploader } from "@luthfipun/yt-uploader";
import { CHROMIUM_MAC_PATH, UPLOAD_PRIVACY_PUBLIC } from "@luthfipun/yt-uploader/dist/helpers/youtubeUploaderOptions";

try {

    const youtubeUploader = new YoutubeUploader(
        CHROMIUM_MAC_PATH,
        UPLOAD_PRIVACY_PUBLIC,
        DISPLAY_FOR_UBUNTU // optional display parameters for ubuntu, usually is ":10.0"
    )

    await youtubeUploader.Login(YOUR_EMAIL, YOUR_PASSWORD)
    console.log('LoggedIn to your account')

    console.log('Uploading ...')
    await youtubeUploader.UploadVideo(
        VIDEO_PATH,
        VIDEO_TITLE,
        VIDEO_DESCRIPTION,
        VIDEO_THUMBNAIL, // optional
        VIDEO_TAGS // sample : #test, #videotest, #testing,
    )

    console.log('Uploading successfully')
    await youtubeUploader.CloseBrowser()
}catch (e) {
    console.log(e)
}
```

## Options

### Chromium Executable Path
|OS|Variable|
|-|-|
|MacOS|CHROMIUM_MAC_PATH|
|Ubuntu|CHROMIUM_UBUNTU_PATH|
|Windows 64|CHROMIUM_WINDOWS_PATH|

### Upload Privacy
|Privacy|Variable|
|-|-|
|Public|UPLOAD_PRIVACY_PUBLIC|
|Private|UPLOAD_PRIVACY_PRIVATE|
|Unlisted|UPLOAD_PRIVACY_UNLISTED|

### Display User for Ubuntu Only
Optional options display only for ubuntu usually the display is ":10.0", but you can check with command ``printenv DISPLAY`` with your active desktop
