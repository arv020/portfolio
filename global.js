
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
  if (link.host === location.host && link.pathname === location.pathname) {
    link.classList.add('current');
  }
if (link.host !== location.host) {
    link.target = "_blank";
    link.rel = "noopener noreferrer"; // good practice for security
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


export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);

    if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.statusText}`);
   }
  const data = await response.json();
  return data;

  console.log(response)
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

// export function renderProjects(project, containerElement, headingLevel = 'h2') {
//   // write javascript that will allow dynamic heading levels based on previous function

//   containerElement.innerHTML = '';
//   //create new article element
//   const article = document.createElement('article');

//   article.innerHTML = `
//     <h3>${project.title}</h3>
//     <img src="${project.image}" alt="${project.title}">
//     <p>${project.description}</p>
// `;
//   containerElement.appendChild(article);
// }

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  containerElement.innerHTML = '';

  if (!Array.isArray(projects)) {
    console.error('renderProjects: Expected an array of projects');
    return;
  }

  if (!containerElement) {
    console.error('renderProjects: Invalid container element');
    return;
  }

  // Detect if running on GitHub Pages
  const isGitHubPages = window.location.hostname.includes('github.io');
  const basePath = isGitHubPages ? '/portfolio/' : '/';

  projects.forEach((project) => {
    const article = document.createElement('article');
    const imagePath = `${basePath}${project.image.replace(/^\/+/, '')}`;

    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      <p>Year: ${project.year}</p>
      <img src="${imagePath}" alt="${project.title}">
      <p>${project.description}</p>
    `;
    containerElement.appendChild(article);
  });

  if (projects.length === 0) {
    containerElement.innerHTML = '<p>No projects found.</p>';
  }
}



// export async function fetchGitHubData(username) {
//   // return statement here
//   return fetchJSON(`https://api.github.com/users/${username}`);

// }

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);

  // try {
  //   const response = await fetch(`https://api.github.com/users/${username}`);
  //   if (!response.ok) throw new Error(`GitHub fetch failed: ${response.status}`);
  //   return await response.json();
  // } catch (err) {
  //   console.error('Error in fetchGitHubData:', err);
  //   return null;
  // }
}
