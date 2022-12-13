import Puppeteer from 'puppeteer-extra';
import UserAgentPlugin from 'puppeteer-extra-plugin-anonymize-ua';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import Delay from 'delay';
import FS from 'fs';
import FSExtra from 'fs-extra';
import { getElement } from './helpers/getElement.js';
import {
	CHROMIUM_MAC_PATH,
	CHROMIUM_UBUNTU_PATH,
	CHROMIUM_WINDOWS_PATH,
	UPLOAD_PRIVACY_PRIVATE,
	UPLOAD_PRIVACY_PUBLIC,
	UPLOAD_PRIVACY_UNLISTED,
} from './helpers/youtubeUploaderOptions.js';

Puppeteer.use(StealthPlugin());
Puppeteer.use(UserAgentPlugin({ makeWindows: true }));

const rootDir = `${process.cwd()}/browser`; // TODO: Make the "Browser" folder appear in temp folder or something

export class YoutubeUploader {
	Browser;
	MainPage;
	privacy;
	chromiumPath;
	display;

	constructor(
		chromiumPath = CHROMIUM_MAC_PATH |
			CHROMIUM_UBUNTU_PATH |
			CHROMIUM_WINDOWS_PATH,
		privacy = UPLOAD_PRIVACY_PUBLIC |
			UPLOAD_PRIVACY_PRIVATE |
			UPLOAD_PRIVACY_UNLISTED,
		display = '',
	) {
		this.chromiumPath = chromiumPath;
		this.display = display;
		this.privacy = privacy;
	}

	// For opening the chromium browser
	OpenBrowser = async directory => {
		try {
			return await Puppeteer.launch({
				headless: false,
				defaultViewport: null,
				userDataDir: directory,
				ignoreDefaultArgs: ['--disable-extensions'],
				executablePath: this.chromiumPath,
				env: {
					DISPLAY: this.display,
				},
			});
		} catch (err) {
			console.log(err);
		}
	};

	// For close the browser at the end
	CloseBrowser = async () => {
		try {
			await this.MainPage.close();
			await this.Browser.close();
			FSExtra.removeSync(rootDir);
		} catch (err) {
			// Handle properly later
			console.log(err);
		}
	};

	// For logging you into youtube studio
	Login = async (Email, Password) => {
		try {
			FSExtra.removeSync(rootDir);
			this.Browser = await this.OpenBrowser(rootDir);
			this.MainPage = await this.Browser.newPage();
			await this.MainPage.goto('https://studio.youtube.com/');
			await this.MainPage.type('input[type="email"]', Email, { delay: 500 });
			await Delay(3000);
			await this.MainPage.keyboard.press('Enter');
			await Delay(5000);
			await this.MainPage.type('input[type="password"]', Password, {
				delay: 600,
			});
			await this.MainPage.keyboard.press('Enter');
		} catch (err) {
			return console.log(err);
		}
	};

	// For uploading your video
	UploadVideo = async (
		Video,
		Title,
		Description = '',
		Thumbnails = '',
		Tags,
	) => {
		// guard clauses
		if (!Video.length) {
			throw new Error('Video source cannot be empty.');
		} else if (!FS.existsSync(Video)) {
			throw new Error(`Cannot find video at: ${Video}`);
		}

		try {
			// Get upload button and click it
			const uploadBtn = await getElement(
				'a[test-id="upload-icon-url"]',
				this.MainPage,
				true,
			);
			await uploadBtn.click();

			// Upload video
			const submitFileBtn = await getElement(
				'#content > input[type=file]',
				this.MainPage,
				true,
			);
			await submitFileBtn.uploadFile(Video);

			// Import title
			const titleBox = await getElement('#textbox', this.MainPage, true);
			await titleBox.click();
			await Delay(800);
			await this.MainPage.evaluate(() =>
				document.execCommand('selectall', false, null),
			);
			await Delay(3000);
			await this.MainPage.keyboard.type(Title.substr(0, 100), { delay: 50 });
			await Delay(4000);

			// Import description
			const descriptionBox = await getElement(
				'ytcp-social-suggestions-textbox[id="description-textarea"]',
				this.MainPage,
			);

			await descriptionBox.click();
			await Delay(900);
			await this.MainPage.evaluate(() =>
				document.execCommand('selectall', false, null),
			);
			await Delay(2000);
			await this.MainPage.keyboard.type(Description.substr(0, 5000), {
				delay: 70,
			});
			await Delay(5000);

			if (Thumbnails) {
				// Import thumbnails
				const submitFileThumbnails = await getElement(
					'input[id="file-loader"]',
					this.MainPage,
					true,
				);
				await submitFileThumbnails.uploadFile(Thumbnails);
				await Delay(2000);
			}

			// Make it not for kids

			const ageRestrictionEl = await getElement(
				'tp-yt-paper-radio-button[name="VIDEO_MADE_FOR_KIDS_NOT_MFK"]',
				this.MainPage,
			);

			await ageRestrictionEl.click();
			await Delay(1000);

			// Show more meta
			const moreBtn = await getElement(
				'ytcp-button[id="toggle-button"]',
				this.MainPage,
				true,
			);
			await moreBtn.click();
			await Delay(3000);

			// Import Tags
			const inputTags = await getElement(
				'ytcp-form-input-container[id="tags-container"]',
				this.MainPage,
				true,
			);
			inputTags.click();
			await Delay(800);
			await this.MainPage.evaluate(() =>
				document.execCommand('selectall', false, null),
			);
			await Delay(1000);
			await this.MainPage.keyboard.type(Tags.substr(0, 500), { delay: 100 });
			await Delay(10000);

			// Keep clicking next till the end
			const nextBtn = await getElement(
				'ytcp-button[id="next-button"]',
				this.MainPage,
			);

			let PrivacyText = await getElement(
				`tp-yt-paper-radio-button[name="${this.privacy}"]`,
				this.MainPage,
			);

			while (!PrivacyText) {
				await nextBtn.click();
				await Delay(1000);
				PrivacyText = await getElement(
					`tp-yt-paper-radio-button[name="${this.privacy}"]`,
					this.MainPage,
				);
			}

			// Make video public
			const privacyBtn = await getElement(
				`tp-yt-paper-radio-button[name="${this.privacy}"]`,
				this.MainPage,
			);

			await privacyBtn.click();
			await Delay(3000);

			// Publish video
			const publishBtn = await getElement(
				'ytcp-button[id="done-button"]',
				this.MainPage,
			);

			await publishBtn.click();

			// Close popup
			const closeBtn = await getElement(
				'ytcp-button[id="close-button"]',
				this.MainPage,
				true,
			);
			await closeBtn.click();
		} catch (err) {
			return console.log(err);
		}
	};
}
