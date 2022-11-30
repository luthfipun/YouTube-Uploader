const Puppeteer = require('puppeteer-extra');
const UserAgentPlugin = require('puppeteer-extra-plugin-anonymize-ua');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const Delay = require('delay');
const FS = require('fs');
const FSExtra = require('fs-extra');
Puppeteer.use(StealthPlugin());
Puppeteer.use(UserAgentPlugin({ makeWindows: true }));

// Helpers
const getElement = require('./helpers/getElement');

const rootDir = `${__dirname}/browser`; // TODO: Make the "Browser" folder appear in temp folder or something

let Browser, MainPage;

// For opening the chromium browser
const OpenBrowser = async Directory => {
	try {
		return await Puppeteer.launch({
			headless: false,
			defaultViewport: null,
			userDataDir: Directory,
			ignoreDefaultArgs: ['--disable-extensions'],
		});
	} catch (err) {
		console.log(err);
	}
};

// For close the browser at the end
const CloseBrowser = async () => {
	try {
		await MainPage.close();
		await Browser.close();
		FSExtra.removeSync(rootDir);
	} catch (err) {
		// Handle properly later
		console.log(err);
	}
};

// For logging you into youtube studio
const Login = async (Email, Password) => {
	try {
		FSExtra.removeSync(rootDir);
		Browser = await OpenBrowser(rootDir);
		MainPage = await Browser.newPage();
		await MainPage.goto('https://studio.youtube.com/');
		await MainPage.type('input[type="email"]', Email, { delay: 500 });
		await Delay(3000);
		await MainPage.keyboard.press('Enter');
		await Delay(5000);
		await MainPage.type('input[type="password"]', Password, { delay: 600 });
		await MainPage.keyboard.press('Enter');
	} catch (err) {
		return console.log(err);
	}
};

// For uploading your video
const UploadVideo = async (
	Video,
	Title,
	Description = '',
	privacy,
	Thumbnails,
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
			MainPage,
			true,
		);
		await uploadBtn.click();

		// Upload video
		const submitFileBtn = await getElement(
			'#content > input[type=file]',
			MainPage,
			true,
		);
		await submitFileBtn.uploadFile(Video);

		// Import title
		const titleBox = await getElement('#textbox', MainPage, true);
		await titleBox.click();
		await Delay(800);
		await MainPage.evaluate(() =>
			document.execCommand('selectall', false, null),
		);
		await Delay(3000);
		await MainPage.keyboard.type(Title.substr(0, 100), { delay: 50 });
		await Delay(4000);

		// Import description
		const descriptionBox = await getElement(
			'ytcp-social-suggestions-textbox[id="description-textarea"]',
			MainPage,
		);

		await descriptionBox.click();
		await Delay(900);
		await MainPage.evaluate(() =>
			document.execCommand('selectall', false, null),
		);
		await Delay(2000);
		await MainPage.keyboard.type(Description.substr(0, 5000), { delay: 70 });
		await Delay(5000);

		// Import thumbnails
		const submitFileThumbnails = await getElement(
			'input[id="file-loader"]',
			MainPage,
			true,
		);
		await submitFileThumbnails.uploadFile(Thumbnails);
		await Delay(2000);

		// Make it not for kids

		const ageRestrictionEl = await getElement(
			'tp-yt-paper-radio-button[name="VIDEO_MADE_FOR_KIDS_NOT_MFK"]',
			MainPage,
		);

		await ageRestrictionEl.click();
		await Delay(1000);

		// Show more meta
		const moreBtn = await getElement(
			'ytcp-button[id="toggle-button"]',
			MainPage,
			true,
		);
		await moreBtn.click();
		await Delay(3000);

		// Import Tags
		const inputTags = await getElement(
			'ytcp-form-input-container[id="tags-container"]',
			MainPage,
			true,
		);
		inputTags.click();
		await Delay(800);
		await MainPage.evaluate(() =>
			document.execCommand('selectall', false, null),
		);
		await Delay(1000);
		await MainPage.keyboard.type(Tags.substr(0, 500), { delay: 100 });
		await Delay(10000);

		// Keep clicking next till the end
		const nextBtn = await getElement('ytcp-button[id="next-button"]', MainPage);

		let PrivacyText = await getElement(
			`tp-yt-paper-radio-button[name="${privacy}"]`,
			MainPage,
		);

		while (!PrivacyText) {
			await nextBtn.click();
			await Delay(1000);
			PrivacyText = await getElement(
				`tp-yt-paper-radio-button[name="${privacy}"]`,
				MainPage,
			);
		}

		// Make video public
		const privacyBtn = await getElement(
			`tp-yt-paper-radio-button[name="${privacy}"]`,
			MainPage,
		);

		await privacyBtn.click();
		await Delay(3000);

		// Publish video
		const publishBtn = await getElement(
			'ytcp-button[id="done-button"]',
			MainPage,
		);

		await publishBtn.click();

		// Close popup
		const closeBtn = await getElement(
			'ytcp-button[id="close-button"]',
			MainPage,
			true,
		);
		await closeBtn.click();
	} catch (err) {
		return console.log(err);
	}
};

module.exports = {
	OpenBrowser,
	CloseBrowser,
	Login,
	UploadVideo,
};
