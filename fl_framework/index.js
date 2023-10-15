function setLocation(curLoc){
    try {
		history.pushState(null, null, curLoc);
		return;
    }
	catch(e) {}
    location.hash = '#' + curLoc;
}

class FlCursor {
	constructor (options) {
		this.options = options;
		if (!options) {
			this.options = {
				saveCache       : true,
				ignoreCachePath : [],
				saveOnlyPath    : ["/fl_system/load_page.html"]
			}
		}
		this.cache = new Object();
		if (!Array.isArray(this.options.ignoreCachePath)) {
			this.options.ignoreCachePath = new Array();
		}
		
		this.curLoc = location.pathname;
		this.events = {};
		
		// Включаем автоматическое обновление содержимого страницы при нажатии кнопки "Назад"
		window.onpopstate = (event) => {
			this.go(location.pathname, false);
		}
	}
	
	isCanCachePage (url) {
		return (this.options.saveCache && this.options.ignoreCachePath.indexOf(url) == -1) ||
		       (!this.options.saveCache && this.options.saveOnlyPath.indexOf(url) != -1);
	}
	
	bindLoad (page, handler) {
		this.events[page] = handler;
	}
	
	getHttpContent (url) {
		if (!this.cache[url]) {
			let rq = new XMLHttpRequest();
			rq.open('GET', url, false);
			rq.send();
			
			if (rq.status == 200) {
				if (this.isCanCachePage(url)) {
					this.cache[url] = rq.responseText;
				}
				return rq.responseText;
			}
			else if (rq.status == 404) {
				rq = new XMLHttpRequest();
				rq.open('GET', `/fl_system/404.html`, false);
				rq.send();
				
				let page = "404. Not found.";
				if (rq.status == 200) {
					page = rq.responseText;
				}
				
				if (this.isCanCachePage(url)) {
					this.cache[url] = page;
				}
				return page;
			}
			else {
				let page = `Http error: ${rq.status}`;
				
				rq = new XMLHttpRequest();
				rq.open('GET', `/fl_system/${rq.status}.html`, false);
				rq.send();
				
				if (rq.status == 200) {
					page = rq.responseText;
				}
				
				if (this.isCanCachePage(url)) {
					this.cache[url] = page;
				}
				return page;
			}
		}
		else return this.cache[url];
	}
	
	loading () {
		/*let rq = new XMLHttpRequest();
		rq.open('GET', `/fl_system/load_page.html`, false);
		rq.send();
		if (rq.status == 200) {
			let page = rq.responseText;
			document.getElementById('fl.area').innerHTML = page;
		}*/
		document.getElementById('fl.area').innerHTML = this.getHttpContent("/fl_system/load_page.html");
	}
	
	goToLocation (href) {
		window.location.href = href;
	}
	
	goJust (href, refEdit = true, callFromGo = false) {
		if (refEdit && !callFromGo) {
			this.loading();
			setLocation(href);
			this.curLoc = href;
		}
		
		document.getElementById('fl.area').innerHTML = this.getHttpContent(`/fl_dir${href}`);
		
		setTimeout(() => {
			let page = href.split('#')[0].split('?')[0];
			while (page.at(-1) === '/') 
				page = page.slice(0, page.length - 1);
			this.events[page]?.();
		}, 0);
	}
	
	go (href, refEdit = true) {
		if (refEdit) {
			this.loading();
			setLocation(href);
			this.curLoc = href;
		}
		
		setTimeout(async () => this.goJust(href, refEdit, true), 1);
	}
}

const fl = new FlCursor();