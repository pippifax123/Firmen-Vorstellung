const vorstellungen = {
// Die Hintergrundbilder und Logos müssen wie folgt benannt werden und können .png oder .jpg Formate sein
// "logo_" oder "background_" + "name" wie in der Auflistung
// Hier kommen die Vorstellungen rein mit jeweils folgenden Angaben

// MoritzHümmer {
// 	firma: "",
// 	text: ``
// },

// erste Zeile: Name zusammengeschrieben wie bei den Dateien
// zweite Zeile: firma in ""
// dritte Zeile: text in ``, falls man mehrere Zeilen hat oder an bestimmten stellen eine neue Zeile machen will
// }, am Ende, damit man das nächste beginnen kann

	LeniBrand: {
		firma: "BrandFashion",
		text: "Die brand neue Fashion Seite"
	}
};

let abgaben = 0;
let count = 0;

function set() {
	const container = document.getElementById("sec");

	Object.entries(vorstellungen).forEach(([key, data]) => {
		const firmname = data.firma;
		count = count + 1;
		const btn = document.createElement("button");

		btn.type = "button";
		btn.className = "get-to-vorstellung-btn";
		btn.id = key;
		btn.textContent = firmname;

		btn.addEventListener("click", () => {
			const url = `../LogoVorstellung/Firmen/?type=${encodeURIComponent(key)}`;
			window.location.href = url;
		});

		container.appendChild(btn);
	});
	console.log(count);

	// Theme-Color anhand des body::before-Hintergrunds setzen
	const style = getComputedStyle(document.body, "::before");
	const bg = style.backgroundImage;
	const urlMatch = bg.match(/url\(["']?(.+?)["']?\)/);
	if (!urlMatch) return;

	const imageUrl = urlMatch[1];
	const img = new Image();
	img.crossOrigin = "Anonymous";
	img.src = imageUrl;

	img.onload = () => {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		canvas.width = img.naturalWidth;
		canvas.height = 1;
		ctx.drawImage(img, 0, 0, canvas.width, 1);

		const data = ctx.getImageData(0, 0, canvas.width, 1).data;
		let r = 0,
			g = 0,
			b = 0;

		for (let i = 0; i < data.length; i += 4) {
			r += data[i];
			g += data[i + 1];
			b += data[i + 2];
		}

		const pixelCount = data.length / 4;
		r = Math.round(r / pixelCount);
		g = Math.round(g / pixelCount);
		b = Math.round(b / pixelCount);

		let meta = document.querySelector('meta[name="theme-color"]');
		if (!meta) {
			meta = document.createElement("meta");
			meta.name = "theme-color";
			document.head.appendChild(meta);
		}
		meta.setAttribute("content", `rgb(${r}, ${g}, ${b})`);
	};
}

document.addEventListener("DOMContentLoaded", () => {
	localStorage.setItem("Firmen", JSON.stringify(vorstellungen));
	set();
});
