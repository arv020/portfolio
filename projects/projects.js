import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
console.log("✅ projects.js loaded successfully");

// Fetching data
const projects = await fetchJSON('../lib/projects.json');
let currentFilteredProjects = projects;


// selecting project container
const projectsContainer = document.querySelector('.projects');

// get each project with h2 heading level
renderProjects(projects, projectsContainer, 'h2');

//adding count of projects
const titleElement = document.querySelector('.projects-title');
if (titleElement && Array.isArray(projects)) {
  titleElement.textContent = `${projects.length} Projects`;
}

//creating circle demo
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

// let arc = arcGenerator({
//   startAngle: 0,
//   endAngle: 2 * Math.PI,
// });

//d3.select('svg').append('path').attr('d', arc).attr('fill', 'red');

//step 1.4
//let data = [1, 2, 3, 4, 5, 5];
let rolledData = d3.rollups(
  projects,
  (v) => v.length,
  (d) => d.year,
);

let data = rolledData.map(([year, count]) => {
  return { value: count, label: year };
});
// let data = [
//   { value: 1, label: 'apples' },
//   { value: 2, label: 'oranges' },
//   { value: 3, label: 'mangos' },
//   { value: 4, label: 'pears' },
//   { value: 5, label: 'limes' },
//   { value: 5, label: 'cherries' },
// ];
let sliceGenerator = d3.pie().value((d) => d.value);

let arcData = sliceGenerator(data);
let arcs = arcData.map((d) => arcGenerator(d));
let total = 0;

for (let d of data) {total += d;}

let angle = 0;
//let arcData = [];

for (let d of data) {
  let endAngle = angle + (d / total) * 2 * Math.PI;
  arcData.push({ startAngle: angle, endAngle });
  angle = endAngle;
}

//let arcs = arcData.map((d) => arcGenerator(d));

// arcs.forEach((arc) => {
//   svg.append('path').attr('d', arc).attr('fill', 'red');
// });

//let colors = ['gold', 'purple'];
let colors = d3.scaleOrdinal(d3.schemeTableau10);


arcs.forEach((arc, idx) => {
    d3.select('svg')
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(idx)) // Fill in the attribute for fill color via indexing the colors variable
})

let selectedIndex = -1; // tracks currently selected wedge

function renderPieChart(projectsGiven) {
  // Select SVG and legend elements
  const svg = d3.select('#projects-plot');
  const legend = d3.select('.legend');

  // Clear previous paths and legend items
  svg.selectAll('path').remove();
  legend.selectAll('li').remove();

  // Group projects by year and count
  const rolledData = d3.rollups(
    projectsGiven,
    v => v.length,
    d => d.year
  );

  // Convert to objects for pie chart
  const data = rolledData.map(([year, count]) => ({ label: year, value: count }));
  if (data.length === 0) return; // nothing to render

  // Pie and arc generators
  const pieGenerator = d3.pie().value(d => d.value);
  const pieData = pieGenerator(data);
  const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

  // Color palette
  const colors = d3.schemeCategory10;

  // Draw pie slices
  pieData.forEach((d, i) => {
    svg.append('path')
       .attr('d', arcGenerator(d))
       .attr('fill', colors[i % colors.length])
       .attr('class', i === selectedIndex ? 'selected' : '')
       .on('click', () => {
         // Toggle selection
         selectedIndex = selectedIndex === i ? -1 : i;

         // Update slice highlight
         svg.selectAll('path')
            .attr('class', (_, idx) => idx === selectedIndex ? 'selected' : '');

         // Update legend highlight
         legend.selectAll('li')
               .attr('class', (_, idx) => idx === selectedIndex ? 'selected' : 'legend-item');

         // Filter projects based on selected wedge
         let projectsToRender;
         if (selectedIndex === -1) {
            projectsToRender = currentFilteredProjects; // start from filtered set
          } else {
            const selectedYear = data[selectedIndex].label;
            projectsToRender = currentFilteredProjects.filter(p => p.year === selectedYear);
          }


         // Render filtered projects
         renderProjects(projectsToRender, projectsContainer, 'h2');
       });
  });

  // Draw legend items
  pieData.forEach((d, i) => {
    legend.append('li')
          .attr('style', `--color:${colors[i % colors.length]}`)
          .attr('class', i === selectedIndex ? 'selected' : 'legend-item')
          .html(`<span class="swatch"></span> ${d.data.label} <em>(${d.data.value})</em>`);
  });
}

// Initial render on page load
renderPieChart(projects);

// Search bar listener (filter and re-render)
let query = '';
const searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('change', (event) => {
  query = event.target.value.toLowerCase();

  // Filter from all projects based on the search query
  currentFilteredProjects = projects.filter(project =>
    Object.values(project).join('\n').toLowerCase().includes(query)
  );

  // Reset selection when search changes
  selectedIndex = -1;

  // Re-render both
  renderProjects(currentFilteredProjects, projectsContainer, 'h2');
  renderPieChart(currentFilteredProjects);
});
