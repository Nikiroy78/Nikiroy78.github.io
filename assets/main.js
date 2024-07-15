import { blog } from "./pages/blog.js";
import { passwordManager } from "./pages/password-manager.js";
/* Альтернативное главное меню */
let altMenuSelectedPage = 1;
const altPages = [
	`<h5 style="color: white;">Добро пожаловать на мой ресурс</h5><p style="color: white;">Это официальный ресурс FullGreaM.</p><button onclick="fl.go('/contacts');" type="button" class="btn btn-outline-light">Мои контакты</button>`,
	`<h5 style="color: white;">О проектах и работах</h5>
	<p style="color: white;">Здесь представлены мои проекты, работы с активными и актуальными ссылками на скачивание.</p>
	<button onclick="fl.go('/projects');" type="button" class="btn btn-outline-light">Мои проекты</button>`,
	`<h5 style="color: white;">О прочей информации</h5>
	<p style="color: white;">Также здесь представлен (или будет представлен) мой личный блог, а также, блог, касающийся моих проектов или проектов моей команды.</p>
	<button onclick="fl.go('/blog');" type="button" class="btn btn-outline-light">Мой блог</button>`
];
function setAltMenuPage(pageNumber) {
	altMenuSelectedPage = pageNumber;
	if (altMenuSelectedPage <= 0) {
		altMenuSelectedPage = 3;
	}
	else if (altMenuSelectedPage > 3) {
		altMenuSelectedPage = 1;
	}
	document.getElementsByTagName('body')[0].style.backgroundImage = `url("/assets/hello/m/${altMenuSelectedPage}.png")`;
	document.getElementById('alt-carousel-viewer').innerHTML = altPages[altMenuSelectedPage - 1];
};
/* Альтернативное главное меню */
setTimeout(async () => {
	fl.go(window.location.pathname + location.search)
}, 50);

let isMobile = window.screen.availWidth / window.screen.availHeight <= 1.45;

function goFromMobileWarning () {
	const currentURL = new URL(location.href);
	if (!document.cookie.includes('warning_showed=true')) document.cookie += 'warning_showed=true;';
	fl.go(currentURL.searchParams.get("go"));
}

if (isMobile && !document.cookie.includes('warning_showed=true')) {
	// Я это уберу как только буду уверен, что на мобильной версии нет никаких проблем
	fl.go('/mobile-warning?go=' + new URLSearchParams(location.pathname + location.search).toString().slice(0, -1));
}

fl.bindLoad('/blog', () => {
	blog();
});
fl.bindLoad('/password-manager', () => {
	passwordManager();
});

fl.bindLoad('/main-mobile', () => {
	document.getElementById('alt-main-prev').onclick = () => setAltMenuPage(altMenuSelectedPage - 1);
	document.getElementById('alt-main-next').onclick = () => setAltMenuPage(altMenuSelectedPage + 1);
});

fl.bindLoad('/mobile-warning', () => {
	document.getElementById('mobile-warning-go').onclick = () => goFromMobileWarning();
});

let mainMenuErrorHandled = false;

setInterval(async () => {
// setTimeout(async () => {
	const navbarHeight = +(document.getElementById("navbar-main")?.offsetHeight);
	if (!mainMenuErrorHandled && location.pathname == "/" && document.getElementById('main_img1')?.src) {
		document.getElementById('main_img1').src = window.screen.availWidth / window.screen.availHeight > 1.45 ? "/assets/hello/1.gif" : "/assets/hello/m/1.gif";
		document.getElementById('main_img2').src = window.screen.availWidth / window.screen.availHeight > 1.45 ? "/assets/hello/2.png" : "/assets/hello/m/2.png";
		document.getElementById('main_img3').src = window.screen.availWidth / window.screen.availHeight > 1.45 ? "/assets/hello/3.png" : "/assets/hello/m/3.png";
	}
	const selectedCSS = Object.entries(document.styleSheets).filter(([key, cssFileObject]) => cssFileObject.href == `${location.origin}/assets/main.css`)[0][1];
	Object.entries(selectedCSS.rules).filter(([key, rule]) => rule.selectorText == '.carousel > .carousel-inner > .carousel-item > img')[0][1].style.height = `calc(100vh - ${navbarHeight}px)`
	
	const currHtml = document.getElementById('alt-carousel-viewer')?.innerHTML;
	mainMenuErrorHandled = currHtml?.trim() == altPages[altMenuSelectedPage - 1]?.trim();
	
	if (!mainMenuErrorHandled && window.screen.availWidth < 768 && location.pathname == "/") {  // Обработка ошибки вёрстки на главной странице
		mainMenuErrorHandled = true;
		setTimeout(async () => {
			fl.goJust('/main-mobile', false);
			document.getElementsByTagName('body')[0].style.backgroundImage = 'url("/assets/hello/m/1.gif")';
		}, 150);
	}
	else if (mainMenuErrorHandled && window.screen.availWidth >= 768 && location.pathname == "/") {  // Вернуть нормальную версию вёрстки
		mainMenuErrorHandled = false;
		document.getElementsByTagName('body')[0].style.backgroundImage = '';
		fl.goJust('/', false);
	}
	else if (location.pathname !== "/") {
		mainMenuErrorHandled = false;
		document.getElementsByTagName('body')[0].style.backgroundImage = '';
	}
}, 1);
