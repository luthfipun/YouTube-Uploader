# YouTube Uploader

YouTube Upload is a program that will automatically upload video to YouTube

## Installation
```shell
npm i @luthfipun/yt-uploader
```
or
```shell
yarn add @luthfipun/yt-uploader
```

## Usages

```js
const YoutubeUploader = require('@luthfipun/yt-uploader')

try {
    const youtubeUploader = new YoutubeUploader()
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
}catch {
    throw Error('Error...')
}
```
