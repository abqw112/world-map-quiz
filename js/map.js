// js/map.js — D3 map rendering, zoom/pan, click handling

import { buildQuizzableList, MICROSTATE_COORDS, REGIONS, getRegion, getDisplayName } from './data.js';

/* global d3, topojson */

let svg, g, projection, pathGen, zoom, tooltip;
let quizzablePolygons = new Map(); // id → feature
let microstateIds = [];
let allGeoFeatures = [];
let onClick = null; // callback(countryId)
let currentTransform = d3.zoomIdentity;
let guessedIds = new Set();

const TOPO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';

/**
 * Load TopoJSON and render the map into the given container.
 * onClickCb(countryId) is called when a quizzable country is clicked.
 */
export async function loadAndRender(containerSelector, onClickCb) {
  onClick = onClickCb;

  const container = d3.select(containerSelector);
  const { width, height } = container.node().getBoundingClientRect();

  svg = container.append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width} ${height}`);

  g = svg.append('g');

  // Create tooltip div
  tooltip = container.append('div').attr('class', 'map-tooltip');

  // Set up projection
  projection = d3.geoNaturalEarth1();

  // Load data
  const topoData = await d3.json(TOPO_URL);
  const countries = topojson.feature(topoData, topoData.objects.countries);
  allGeoFeatures = countries.features;

  // Fit projection to container
  projection.fitSize([width, height], countries);
  pathGen = d3.geoPath().projection(projection);

  // Build quizzable list
  const quizzable = buildQuizzableList(allGeoFeatures);
  quizzablePolygons = quizzable.polygonCountries;
  microstateIds = quizzable.microstateIds;

  // Render all country paths (including non-quizzable for full map)
  g.selectAll('path.country')
    .data(allGeoFeatures)
    .join('path')
    .attr('class', d => {
      const id = Number(d.id);
      return quizzablePolygons.has(id) ? 'country quizzable' : 'country non-quizzable';
    })
    .attr('d', pathGen)
    .attr('data-id', d => Number(d.id))
    .on('click', function (event, d) {
      const id = Number(d.id);
      if (quizzablePolygons.has(id) && onClick) {
        onClick(id);
      }
    })
    .on('mousemove', function (event, d) {
      const id = Number(d.id);
      if (guessedIds.has(id)) {
        const name = getDisplayName(id);
        tooltip.text(name).classed('visible', true)
          .style('left', (event.offsetX + 12) + 'px')
          .style('top', (event.offsetY - 24) + 'px');
      }
    })
    .on('mouseleave', function () {
      tooltip.classed('visible', false);
    });

  // Render microstate circle markers (on top of polygons for small countries)
  const microstateSet = new Set(microstateIds);
  g.selectAll('circle.microstate')
    .data(microstateIds)
    .join('circle')
    .attr('class', 'microstate quizzable')
    .attr('data-id', d => d)
    .attr('cx', d => projection(MICROSTATE_COORDS[d])[0])
    .attr('cy', d => projection(MICROSTATE_COORDS[d])[1])
    .attr('r', 6)
    .on('click', function (event, d) {
      event.stopPropagation();
      if (onClick) onClick(d);
    })
    .on('mousemove', function (event, d) {
      if (guessedIds.has(d)) {
        const name = getDisplayName(d);
        tooltip.text(name).classed('visible', true)
          .style('left', (event.offsetX + 12) + 'px')
          .style('top', (event.offsetY - 24) + 'px');
      }
    })
    .on('mouseleave', function () {
      tooltip.classed('visible', false);
    });

  // Set up zoom
  zoom = d3.zoom()
    .scaleExtent([1, 12])
    .on('zoom', (event) => {
      currentTransform = event.transform;
      g.attr('transform', event.transform);
      // Scale strokes inversely so borders don't get thick
      g.selectAll('path.country')
        .style('stroke-width', `${0.5 / event.transform.k}px`);
      // Scale microstate circles inversely so they stay visible
      g.selectAll('circle.microstate')
        .attr('r', 6 / event.transform.k);
    });

  svg.call(zoom);

  return { quizzablePolygons, microstateIds };
}

/**
 * Visually select a country (yellow highlight)
 */
export function selectCountry(countryId) {
  // Remove previous selection
  g.selectAll('.selected').classed('selected', false);

  // Highlight new selection (both polygon and circle if both exist)
  g.selectAll(`[data-id="${countryId}"]`).classed('selected', true);
}

/**
 * Mark a country as correctly guessed (region color)
 */
export function markGuessed(countryId) {
  guessedIds.add(countryId);
  const region = getRegion(countryId);
  const color = region ? REGIONS[region].color : '#888';

  g.selectAll(`[data-id="${countryId}"]`)
    .classed('selected', false)
    .classed('guessed', true)
    .style('fill', color);
}

/**
 * Deselect the currently selected country
 */
export function deselectAll() {
  g.selectAll('.selected').classed('selected', false);
}

/**
 * Smoothly zoom/pan to center a country. Zoom level is based on the
 * country's bounding box so that it's clearly visible but neighboring
 * countries remain in view.
 */
export function zoomToCountry(countryId) {
  const svgNode = svg.node();
  const { width, height } = svgNode.viewBox.baseVal;

  // Try to get bounds from the polygon path
  const pathEl = g.select(`path[data-id="${countryId}"]`);
  let cx, cy, bbox;

  if (!pathEl.empty()) {
    bbox = pathEl.node().getBBox();
  } else if (MICROSTATE_COORDS[countryId]) {
    // Microstate with no polygon — use projected coords
    const [px, py] = projection(MICROSTATE_COORDS[countryId]);
    bbox = { x: px - 5, y: py - 5, width: 10, height: 10 };
  } else {
    return;
  }

  cx = bbox.x + bbox.width / 2;
  cy = bbox.y + bbox.height / 2;

  // Calculate zoom: fit the country bbox with generous padding (3x–5x the bbox)
  // so you can see neighbors, clamped to [2, 8]
  const pad = 4;
  const scaleX = width / (bbox.width * pad);
  const scaleY = height / (bbox.height * pad);
  const k = Math.min(Math.max(Math.min(scaleX, scaleY), 2), 8);

  const tx = width / 2 - cx * k;
  const ty = height / 2 - cy * k;

  const transform = d3.zoomIdentity.translate(tx, ty).scale(k);
  svg.transition().duration(800).call(zoom.transform, transform);
}

export function zoomIn() {
  svg.transition().duration(300).call(zoom.scaleBy, 1.5);
}

export function zoomOut() {
  svg.transition().duration(300).call(zoom.scaleBy, 1 / 1.5);
}

export function zoomReset() {
  svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
}
