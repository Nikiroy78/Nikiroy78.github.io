const blogpostsUrl = "/blog/posts.json";

function bindImageView (id, url) {
	document.getElementById(id).onclick = () => {
		const imageModal = new bootstrap.Modal(document.getElementById('imageModal'), {});
		imageModal.show();
		document.getElementById('image-viewer-url').src = url;
	};
}

function testBlock () {
	return; // uncomment this at realese
	bindImageView('blog-img-0:0', 'https://warhammerart.com/wp-content/uploads/2021/08/Adeptus-Mechanicus.jpg');
	bindImageView('blog-img-0:1', 'https://warzonestudio.com/image/catalog/blog/Admech-review/Admech-codex-review-02.jpg');
	bindImageView('blog-img-0:2', 'https://i.pinimg.com/originals/7a/5c/0a/7a5c0a3a91db6011a49781c4016124a2.jpg');
}

function dateFormater (value) {
	value = value.toString();
	if (value.length === 1) value = '0' + value;
	return value;
} 

function imagesDisplay (item, index) {
	const items = item.attachments.images.map((imageUrl, imageId) => {
		setTimeout(() => bindImageView(`blog-img-${index}:${imageId}`, imageUrl), 0);
		return `<div class="carousel-item blog-post-image${imageId === 0 ? ' active' : ''}" id="blog-img-${index}:${imageId}"><img src=${JSON.stringify(imageUrl)} class="d-block w-100" alt="..."></div>`
	});
	const buttons = items.map((_, id) => `<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${id}"${id === 0 ? ' class="active" aria-current="true"' : ''} aria-label="Slide ${id}"></button>`);
	return { items, buttons };
}

function generateItem (item, index) {
	const date = new Date(item.date * 1000);
	const images = item.attachments.images.length === 0 ? {
		buttons : [],
		items   : []
	} : imagesDisplay(item, index);
	// console.log(date);
	
	const page = `<div class="blog-post-card" id="post-${index}" style="margin-bottom: 1.5%;">
		<center>
			<h3 style="padding-top: 1.5%;">${item.title}</h3>
			<small style="color: rgba(255,255,255,0.5); padding-bottom: 0.5%;">
				<div>Опубликовано: ${dateFormater(date.getDate())}.${dateFormater(date.getMonth())}.${date.getFullYear()} в ${date.getHours()}:${dateFormater(date.getMinutes())}</div>
				<div id="posted-by-${index}" hidden>Через telegram</div>
			</small>
		</center>
		<p style="padding: 2%;">${item.data.replace(/\n/g, "<br/>")}</p>
		<!-- Изображения -->
		<center><div id="carouselExampleIndicators" class="carousel slide blog-post-image-carousel" data-bs-ride="carousel" id="post-images-${index}"${item.attachments.images.length === 0 ? ' hidden' : ''}>
		  <div class="carousel-indicators"${item.attachments.images.length === 1 ? ' hidden' : ''}>
		    ${images.buttons.join('\n')}
		  </div>
		  <div class="carousel-inner">
		    ${images.items.join('\n')}
		  </div>
		  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"  data-bs-slide="prev"${item.attachments.images.length === 1 ? ' hidden' : ''}>
			<span class="carousel-control-prev-icon" aria-hidden="true"></span>
			<span class="visually-hidden">Предыдущий</span>
		  </button>
		  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"  data-bs-slide="next"${item.attachments.images.length === 1 ? ' hidden' : ''}>
			<span class="carousel-control-next-icon" aria-hidden="true"></span>
			<span class="visually-hidden">Следующий</span>
		  </button>
		</div></center>
		<!-- Файлы -->
		<div class="accordion text-dark bg-dark" id="accordionExample" style="margin-left: 2.5%; margin-right: 2.5%; margin-top: 2.5%;" hidden>
			<div class="accordion-item">
				<h5 class="accordion-header" id="headingOne">
					<button class="accordion-button bg-dark text-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
						Файлы
					</button>
				</h5>
				<div id="collapseOne" class="accordion-collapse bg-dark text-light collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
					<div class="accordion-body">
						<!-- <strong>Это тело аккордеона первого элемента.</strong> По умолчанию оно скрыто, пока плагин сворачивания не добавит соответствующие классы, которые мы используем для стилизации каждого элемента. Эти классы управляют общим внешним видом, а также отображением и скрытием с помощью переходов CSS. Вы можете изменить все это с помощью собственного CSS или переопределить наши переменные по умолчанию. Также стоит отметить, что практически любой HTML может быть помещен в <code>.accordion-body</code>, хотя переход ограничивает переполнение. -->
						<p><a href="https://github.com/student-manager/student-manager/releases/download/1.1.1/windows.x64.Student.manager.portabel.zip">windows.x64.Student.manager.portabel.zip (111 Mb)</a></p>
					</div>
				</div>
			</div>
		</div>
		<!-- Рекации -->
		<button type="button" class="btn btn-outline-success" style="margin-left: 2.5%; margin-top: 1.5%; margin-bottom: 1.5%;" onclick="alert('Функция в разработке!');">Нравится (0)</button>
		<button type="button" class="btn btn-outline-secondary" style="margin-left: 0.5%; margin-top: 1.5%; margin-bottom: 1.5%;" onclick="alert('Функция в разработке!');">Комментарии (0)</button>
	</div>`;
	
	return page;
}

export function blog () {
	//testBlock();
	const xhr = new XMLHttpRequest();
	xhr.open('GET', blogpostsUrl, true);
	
	xhr.onerror = () => {
		document.getElementById('blog-posts').innerHTML = `<center><img src="/assets/404.png" class="sys-win-img"></img><h2>Упс..</h2><p>Во время работы произошла ошибка, повторите запрос позже</p></center>`;
	}
	
	xhr.onload = () => {
		try {
			if (xhr.status === 200) {
				// console.log(xhr.response);
				const data = JSON.parse(xhr.response);
				// console.log(data);
				document.getElementById('blog-posts').innerHTML = '<hr/>';
				data.posts.sort((a, b) => b.date - a.date).forEach((item, index) => {
					document.getElementById('blog-posts').innerHTML += generateItem(item, index);
				});
			}
			else {
				xhr.onerror();
			}
		}
		catch (err) {
			console.log(err);
			return xhr.onerror();
		}
	};
	
	xhr.send();
}