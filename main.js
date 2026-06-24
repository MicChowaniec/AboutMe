const siteConfig = {
  brand: "Michał Chowaniec",
  lessonsUrl: "https://micchowaniec.github.io/ABoMatma/",
  websiteUrl: "https://micchowaniec.github.io/ABoStrona/",
  contactEmail: "micchowaniec@gmail.com",
  location: "Online",
};

const yearNodes = document.querySelectorAll("[data-year]");
const brandNodes = document.querySelectorAll("[data-brand]");
const emailLinks = document.querySelectorAll("[data-email-link]");
const locationNodes = document.querySelectorAll("[data-location]");
const lessonsLinks = document.querySelectorAll("[data-lessons-link]");
const websiteLinks = document.querySelectorAll("[data-website-link]");

for (const node of yearNodes) {
  node.textContent = String(new Date().getFullYear());
}

for (const node of brandNodes) {
  node.textContent = siteConfig.brand;
}

for (const node of emailLinks) {
  node.href = `mailto:${siteConfig.contactEmail}`;
}

for (const node of locationNodes) {
  node.textContent = siteConfig.location;
}

for (const node of lessonsLinks) {
  node.href = siteConfig.lessonsUrl;
  node.setAttribute("target", "_blank");
  node.setAttribute("rel", "noreferrer");
}

for (const node of websiteLinks) {
  node.href = siteConfig.websiteUrl;
  node.setAttribute("target", "_blank");
  node.setAttribute("rel", "noreferrer");
}
