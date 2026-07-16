const params = new URLSearchParams(window.location.search);
const type = params.get("type");
const firms = JSON.parse(localStorage.getItem("Firmen") || "{}");

document.body.style.setProperty(
	"--bg-img",
	`linear-gradient(rgba(0,0,0,0.01), rgba(0,0,0,0.02)),
   url("../images/background_${type}.jpg")`
);

const brand = document.querySelector("#topbar .brand");
if (brand && firms[type] && firms[type].firma) {
	brand.textContent = firms[type].firma;
}

const logo = document.getElementById("logo");

async function setLogo(type) {
	const exts = ["jpg", "PNG", "png", "webp", "jpeg"];
	const basePath = `../images/logo_${type}`;

	for (const ext of exts) {
		const url = `${basePath}.${ext}`;
		const res = await fetch(url, { method: "GET" });
		if (res.ok) {
			logo.src = url;
			console.log(url);
			return;
		}
	}
}

setLogo(type);

const text = document.getElementById("sec");
if (firms[type].text) {
	text.textContent = firms[type].text;
} else {
	text.style.display = "none";
}

const title = document.getElementById("title");
title.textContent = firms[type].firma;

if (firms[type].bg) {
	document.documentElement.style.setProperty("--bg-size", firms[type].bg);
}

async function set() {
	const style = getComputedStyle(document.body, "::before");
	const bg = style.backgroundImage;
	const urlMatch = bg.match(/url\(["']?(.+?)["']?\)/);
	if (!urlMatch) return;

	const brightness = await getBrightness(urlMatch[1]);
	const textColor = getContrastColor(brightness);
	document.body.style.setProperty("--text-color", textColor);
}

function getBrightness(imageUrl) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.src = imageUrl;

		img.onload = () => {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");

			canvas.width = img.naturalWidth;
			canvas.height = img.naturalHeight;

			ctx.drawImage(img, 0, 0);

			const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
			let total = 0;
			const pixelCount = data.length / 4;

			for (let i = 0; i < data.length; i += 4) {
				const r = data[i];
				const g = data[i + 1];
				const b = data[i + 2];

				// Standard-Luminanz
				const lum = 0.299 * r + 0.587 * g + 0.114 * b;
				total += lum;
			}

			// Durchschnitt 0–255
			const avgBrightness = total / pixelCount;
			console.log(avgBrightness);

			resolve(avgBrightness);
		};

		img.onerror = () => reject("Pic not loaded");
	});
}

function getContrastColor(brightness) {
	return brightness > 128 ? "rgba(0, 0, 0, 0.9)" : "rgba(255, 255, 255, 0.9)";
}

set();
