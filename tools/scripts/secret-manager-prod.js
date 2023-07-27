const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const fs = require('fs');
const path = require('path');
const { cwd } = require('process');

//loads every local secrets in process.env needed to load GOOGLE_PROJECT_ID from process.env
require('dotenv').config({
	path: path.resolve(`${__dirname}../../../.env`)
});

//default version defined => latest version
async function accessSecret(version = 'latest') {
	try {
		if (!process.env.GOOGLE_PROJECT_ID) {
			throw "Please set the GOOGLE_PROJECT_ID enviroment variabele.";
		}

		const fullName = `projects/prod-kujali/secrets/environment/versions/${version}`;

		const keyFileLoc = `${__dirname}/../../${process.env.GOOGLE_PROJECT_ID}-secrets.json`;
		console.log(`Loading keyfile :: ${keyFileLoc}`);
		const file = fs.readFileSync(keyFileLoc).toString('utf-8');

		const key = JSON.parse(file);

		const client = new SecretManagerServiceClient({
			credentials: {
				client_email: key.client_email,
				private_key: key.private_key
			}
		});

		console.log(`Loaded keyfile :: ${__dirname}/../../${process.env.GOOGLE_PROJECT_ID}-secrets.json`)

		const [response] = await client.accessSecretVersion({ name: fullName });
		const payload = response.payload.data.toString();

		createDotenvFileFromGoogleSecret(payload);

		return payload;
	} catch (exception) {
		console.log(exception);
	}
}

/**
 * Creates a .env file from the payload of the Google Secret Manager.
 * @param {*} payload the payload of the secret that was loaded from Google Secret Manager.
 */
async function createDotenvFileFromGoogleSecret(payload) {
	//determine the path of the .env file
	//do we use different .env files for different environments? or do we overwrite the .env file for every environment?
	const targetPath = `${__dirname}/../../apps/kujali-functions/src/functions/.env.${process.env.GOOGLE_PROJECT_ID}-secret`;

	fs.writeFile(targetPath, payload, (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log(`.env.${process.env.GOOGLE_PROJECT_ID}-secret file has been created at ${path.resolve(targetPath)}`);
			loadSelectedEnvironmentVariables();
			createBankingSecrets();
		}
	});
};

/**
 * Creates the selected key
 * @param {*} payload the key that was loaded from Google Secret Manager.
 */
async function createLocalKey(payload) {
	const targetPath = `${__dirname}/../../tools/local-dev/service-key.json`;

	fs.writeFile(targetPath, payload, (err) => {
		if (err) {
			console.log(err);
		}
		console.log(`.env.${process.env.GOOGLE_PROJECT_ID}-secret file has been created at ${path.resolve(targetPath)}`);

	});
};

/**
 * Loads the selected environment variables from the .env file that was loaded from Google Secret Manager. 
 * Now these variables are available from process.env.
 */
async function loadSelectedEnvironmentVariables() {
	require('dotenv').config({
		path: path.resolve(`${__dirname}/../../apps/kujali-functions/src/functions/.env.${process.env.GOOGLE_PROJECT_ID}-secret`)
	});
}

async function createBankingSecrets() {

	let secretBankingCerts = [
		{type: 'certificate', path:`projects/prod-kujali/secrets/ponto-certificate/versions/latest`},
		{type: 'certificate', path: `projects/prod-kujali/secrets/ponto-certificate-private-key/versions/latest`},
		{type: 'signature-cert', path: `projects/prod-kujali/secrets/ponto-signature-certificate/versions/latest`},
		{type: 'signature-cert', path: `projects/prod-kujali/secrets/ponto-signature-certificate-private-key/versions/latest`}
	]

	const keyFileLoc = `${__dirname}/../../${process.env.GOOGLE_PROJECT_ID}-secrets.json`;
	console.log(`Loading keyfile :: ${keyFileLoc}`);

	const file = fs.readFileSync(keyFileLoc).toString('utf-8');
	const key = JSON.parse(file);

	console.log(`Loaded keyfile :: ${__dirname}/../../${process.env.GOOGLE_PROJECT_ID}-secrets.json`)

	const client = new SecretManagerServiceClient({
		credentials: {
			client_email: key.client_email,
			private_key: key.private_key
		}
	});

	for (let i = 0; i < secretBankingCerts.length; i++) {

		const type = secretBankingCerts[i].type;
		const path = secretBankingCerts[i].path;
		const [response] = await client.accessSecretVersion({ name: path });
		const payload = response.payload.data.toString();

		createBankingCertificateFiles(type, path, i, payload);
	}
}


/**
 * Creates a .env file from the payload of the Google Secret Manager.
 * @param {*} payload the payload of the secret that was loaded from Google Secret Manager.
 */
function createBankingCertificateFiles(type, filePath, index, payload) {

	let fileName = '';
	let targetPath = '';

	if (type === 'certificate' && index <= 1) {
		fileName = filePath.split('/')[3].split('-').join('_');
		targetPath = `${__dirname}/../../apps/kujali-functions/src/assets/security/certificates/ponto/certificate/${fileName}.pem`;
	} else {
		fileName = filePath.split('/')[3].split('-').join('_');
		targetPath = `${__dirname}/../../apps/kujali-functions/src/assets/security/certificates/ponto/signature-certificate/${fileName}.pem`;
	}

	fs.writeFile(targetPath, payload, (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log(`Secret certificate file has been created at ${path.resolve(targetPath.split('/').slice(0, -1).join('/'))}`);
		}
	});
};

accessSecret();
