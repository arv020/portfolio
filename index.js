// import { fetchJSON, renderProjects, fetchGithubData } from './global.js';

// //fetching the first 3 projects
// const projects = await fetchJSON('./lib/projects.json');
// const latestProjects = projects.slice(0, 3);

// const projectsContainer = document.querySelector('.projects');
// renderProjects(latestProjects, projectsContainer, 'h2');


import {fetchJSON, renderProjects, fetchGitHubData} from './global.js';

const projects = await fetchJSON('./lib/projects.json');

const latestProjects = projects ? projects.slice(0, 3) : [];

const projectsContainer = document.querySelector('.projects');

if (projectsContainer && latestProjects.length > 0) {
  renderProjects(latestProjects, projectsContainer, 'h2');
} else if (!projectsContainer) {
  console.error('Projects container not found in the DOM');
} else if (latestProjects.length === 0) {
  console.warn('No projects to display');
}

// const githubData = await fetchGitHubData('arv020');
// const profileStats = document.querySelector('#profile-stats');

// if (profileStats) {
//   profileStats.innerHTML = `
//         <dl>
//           <dt>Name:</dt><dd>${githubData.name}</dd>
//           <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
//           <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
//           <dt>Followers:</dt><dd>${githubData.followers}</dd>
//           <dt>Following:</dt><dd>${githubData.following}</dd>
//         </dl>
//     `;
// }

console.log('index.js loaded'); // check that the script runs

const profileStats = document.querySelector('#profile-stats');
console.log('Profile stats container:', profileStats);

try {
  const githubData = await fetchGitHubData('arv020');
  console.log('GitHub data fetched:', githubData);

  if (profileStats && githubData) {
    profileStats.innerHTML = `
      <dl>
        <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
        <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
        <dt>Followers:</dt><dd>${githubData.followers}</dd>
        <dt>Following:</dt><dd>${githubData.following}</dd>
      </dl>
    `;
  } else {
    console.warn('Profile container or GitHub data is missing');
  }
} catch (error) {
  console.error('Error fetching GitHub data:', error);
}



