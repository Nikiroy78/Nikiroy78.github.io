setInterval(async () => {
	const isMainMenu = document.getElementById('main_img1')?.src;
	document.getElementById('main_img1').src = window.screen.availWidth / window.screen.availHeight > 1.45 ? "/assets/hello/1.png" : "/assets/hello/m/1.png";
	document.getElementById('main_img2').src = window.screen.availWidth / window.screen.availHeight > 1.45 ? "/assets/hello/2.png" : "/assets/hello/m/2.png";
	document.getElementById('main_img3').src = window.screen.availWidth / window.screen.availHeight > 1.45 ? "/assets/hello/3.png" : "/assets/hello/m/3.png";
}, 1);