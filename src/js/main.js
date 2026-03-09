"use strict";

(function () {
	const cards = Array.from(document.querySelectorAll(".news-card"));
	const prevButton = document.querySelector('[data-news-dir="prev"]');
	const nextButton = document.querySelector('[data-news-dir="next"]');
	const newestButton = document.querySelector('[data-news-dir="newest"]');
	const pageIndicator = document.querySelector(".news-page-indicator");
	const titleElement = document.querySelector(".news-expanded-title");
	const metaElement = document.querySelector(".news-expanded-meta");
	const imageElement = document.querySelector(".news-expanded-image");
	const bodyElement = document.querySelector(".news-expanded-body");
	const cardsPerPage = 4;

	if (!cards.length || !prevButton || !nextButton || !newestButton || !titleElement || !metaElement || !imageElement || !bodyElement) {
		return;
	}

	const totalPages = Math.ceil(cards.length / cardsPerPage);
	let pageIndex = 0;
	let activeIndex = Math.max(
		cards.findIndex((card) => card.classList.contains("is-active")),
		0
	);

	const ensureActiveInPage = () => {
		const pageStart = pageIndex * cardsPerPage;
		const pageEnd = pageStart + cardsPerPage;
		if (activeIndex < pageStart || activeIndex >= pageEnd) {
			activeIndex = pageStart;
		}
	};

	const renderPage = () => {
		const pageStart = pageIndex * cardsPerPage;
		const pageEnd = pageStart + cardsPerPage;

		cards.forEach((card, index) => {
			const isVisible = index >= pageStart && index < pageEnd;
			card.classList.toggle("is-hidden", !isVisible);
		});

		if (pageIndicator) {
			pageIndicator.textContent = `Showing ${Math.min(cardsPerPage, cards.length - pageStart)} of ${cards.length} (Page ${pageIndex + 1} of ${totalPages})`;
		}
	};

	const setActive = (index) => {
		activeIndex = Math.max(0, Math.min(cards.length - 1, index));
		pageIndex = Math.floor(activeIndex / cardsPerPage);
		renderPage();
		ensureActiveInPage();

		cards.forEach((card, cardIndex) => {
			const isActive = cardIndex === activeIndex;
			card.classList.toggle("is-active", isActive);
			card.setAttribute("aria-selected", String(isActive));
		});

		const selected = cards[activeIndex];
		titleElement.textContent = selected.dataset.newsTitle || "";
		metaElement.textContent = selected.dataset.newsMeta || "";
		imageElement.src = selected.dataset.newsImage || "images/NewPlaceholder.jpg";
		imageElement.alt = `${selected.dataset.newsTitle || "Newsletter"} image`;

		const bodyText = selected.dataset.newsBody || "";
		const paragraphs = bodyText
			.split("||")
			.map((paragraph) => paragraph.trim())
			.filter(Boolean);

		bodyElement.innerHTML = "";
		if (!paragraphs.length) {
			const fallbackParagraph = document.createElement("p");
			fallbackParagraph.textContent = "No additional content available.";
			bodyElement.appendChild(fallbackParagraph);
		} else {
			paragraphs.forEach((paragraphText) => {
				const paragraph = document.createElement("p");
				paragraph.textContent = paragraphText;
				bodyElement.appendChild(paragraph);
			});
		}
	};

	cards.forEach((card, index) => {
		card.addEventListener("click", () => setActive(index));
	});

	prevButton.addEventListener("click", () => {
		pageIndex = pageIndex <= 0 ? totalPages - 1 : pageIndex - 1;
		activeIndex = pageIndex * cardsPerPage;
		setActive(activeIndex);
	});

	nextButton.addEventListener("click", () => {
		pageIndex = pageIndex >= totalPages - 1 ? 0 : pageIndex + 1;
		activeIndex = pageIndex * cardsPerPage;
		setActive(activeIndex);
	});

	newestButton.addEventListener("click", () => {
		pageIndex = 0;
		setActive(0);
	});

	setActive(activeIndex);
})();
