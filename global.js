
console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}
/*
const navLinks = $$("nav a");
console.log(navLinks);

let currentLink = navLinks.find(
  (a) => a.host === location.host && a.pathname === location.pathname,
);

console.log('Current link:', currentLink);
currentLink?.classList.add('current');
*/

// Detect BASE_PATH
const BASE_PATH =
  location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    ? '/'              // Local server
    : '/portfolio/';     // GitHub Pages repo name (replace 'website' with your repo name)

// Pages
let pages = [
  { url: 'index.html', title: 'Home' },
  { url: 'projects/index.html', title: 'Projects' },
  { url: 'contact/index.html', title: 'Contact' },
  { url: 'https://github.com/arv020', title: 'Profile', external: true }
];

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let url = !p.url.startsWith('http') ? BASE_PATH + p.url : p.url;
  let title = p.title;

    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);
}

const navLinks = nav.querySelectorAll('a');

navLinks.forEach(link => {
  const linkPath = link.pathname.replace(/index\.html$/, '');
  const currentPath = location.pathname.replace(/index\.html$/, '');

  if (link.host === location.host && linkPath === currentPath) {
    link.classList.add('current');
  }

  if (link.host !== location.host) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
});

document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <label class="color-scheme">
    Theme:
    <select>
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
  `
);
const select = document.querySelector('.color-scheme select');

if (localStorage.colorScheme) {
  document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
  select.value = localStorage.colorScheme;
}

select.addEventListener('input', function(event) {
  document.documentElement.style.setProperty('color-scheme', event.target.value);
  localStorage.colorScheme = event.target.value;
});


// Form
const form = document.querySelector('form');

form?.addEventListener('submit', function(event) {
  event.preventDefault();
});

form?.addEventListener('submit', function(event) {
  event.preventDefault();

  const data = new FormData(form);
  let params = [];

  for (let [name, value] of data) {
    params.push(`${name}=${encodeURIComponent(value)}`);
  }

  const url = `${form.action}?${params.join('&')}`;
  console.log(url);
});

form?.addEventListener('submit', function(event) {
  event.preventDefault();

  const data = new FormData(form);
  let params = [];

  for (let [name, value] of data) {
    params.push(`${name}=${encodeURIComponent(value)}`);
  }

  const url = `${form.action}?${params.join('&')}`;
  location.href = url;
});


