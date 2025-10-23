import { fetchJSON, renderProjects } from '../global.js';
// Fetching data
const projects = await fetchJSON('../lib/projects.json');

// selecting project container
const projectsContainer = document.querySelector('.projects');

// get each project with h2 heading level
renderProjects(projects, projectsContainer, 'h2');

//adding count of projects
const titleElement = document.querySelector('.projects-title');
if (titleElement && Array.isArray(projects)) {
  titleElement.textContent = `${projects.length} Projects`;
}

