import {} from "/assets/sha1.js";
import { hexToBase64 } from "/assets/encode-converter.js";
import { copyTextToClipboard } from "/assets/clipboard.js";

function generatePassword () {
	const generatedPasswordElement = document.getElementById('generated-password');
	const keyword = document.getElementById('keyword').value;
	const service = document.getElementById('service').value.toLowerCase();;
	const login = document.getElementById('login').value.toLowerCase();;
	
	const generatedPassword = hexToBase64(sha1(`${keyword}::${service}::${login}`)) + "#";
	generatedPasswordElement.value = generatedPassword;
}

export function passwordManager () {
	document.getElementById('generate-password').onclick = generatePassword;
	document.getElementById('copy-password').onclick = () => copyTextToClipboard(document.getElementById('generated-password').value);
}