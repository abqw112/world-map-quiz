// js/data.js — Country data, regions, aliases, answer checking

// ISO 3166-1 numeric codes grouped by UN geoscheme regions
export const REGIONS = {
  Africa: {
    color: '#e74c3c',
    subregions: {
      'Northern Africa': [12, 818, 434, 504, 729, 788],
      'Western Africa': [204, 854, 132, 384, 270, 288, 324, 624, 430, 466, 478, 562, 566, 686, 694, 768],
      'Eastern Africa': [108, 174, 262, 232, 231, 404, 450, 454, 480, 508, 646, 690, 706, 728, 800, 834, 894],
      'Middle Africa': [24, 120, 140, 148, 178, 180, 226, 266, 678],
      'Southern Africa': [72, 426, 516, 710, 748, 716]
    }
  },
  Americas: {
    color: '#1abc9c',
    subregions: {
      'Caribbean': [28, 44, 52, 192, 212, 214, 308, 332, 388, 659, 662, 670, 780],
      'Central America': [84, 188, 222, 320, 340, 484, 558, 591],
      'South America': [32, 68, 76, 152, 170, 218, 328, 600, 604, 740, 858, 862],
      'Northern America': [124, 840]
    }
  },
  Asia: {
    color: '#3498db',
    subregions: {
      'Central Asia': [398, 417, 762, 795, 860],
      'Eastern Asia': [156, 392, 408, 410, 496, 158],
      'South-eastern Asia': [96, 116, 360, 418, 458, 104, 608, 702, 764, 704, 626],
      'Southern Asia': [4, 50, 64, 356, 364, 462, 524, 586, 144],
      'Western Asia': [51, 31, 48, 196, 268, 368, 376, 400, 414, 422, 275, 512, 634, 682, 760, 792, 784, 887]
    }
  },
  Europe: {
    color: '#2ecc71',
    subregions: {
      'Eastern Europe': [112, 100, 203, 348, 616, 498, 642, 643, 703, 804],
      'Northern Europe': [208, 233, 246, 352, 372, 428, 440, 578, 752, 826],
      'Southern Europe': [8, 20, 70, 191, 300, 380, 470, 807, 499, 620, 674, 688, 705, 724, 336],
      'Western Europe': [40, 56, 250, 276, 438, 442, 492, 528, 756, 383]
    }
  },
  Oceania: {
    color: '#f39c12',
    subregions: {
      'Australia and New Zealand': [36, 554],
      'Melanesia': [242, 598, 90, 548],
      'Micronesia': [296, 584, 583, 520, 585],
      'Polynesia': [882, 776, 798]
    }
  }
};

// Accepted name aliases for each country (ISO numeric ID → array of names)
// First name in each array is the canonical/display name
export const COUNTRY_ALIASES = {
  // Africa - Northern
  12: ['Algeria'],
  818: ['Egypt'],
  434: ['Libya'],
  504: ['Morocco'],
  729: ['Sudan'],
  788: ['Tunisia'],
  // Africa - Western
  204: ['Benin'],
  854: ['Burkina Faso'],
  132: ['Cape Verde', 'Cabo Verde'],
  384: ['Ivory Coast', "Cote d'Ivoire", "Côte d'Ivoire", 'Cote dIvoire'],
  270: ['Gambia', 'The Gambia'],
  288: ['Ghana'],
  324: ['Guinea'],
  624: ['Guinea-Bissau', 'Guinea Bissau'],
  430: ['Liberia'],
  466: ['Mali'],
  478: ['Mauritania'],
  562: ['Niger'],
  566: ['Nigeria'],
  686: ['Senegal'],
  694: ['Sierra Leone'],
  768: ['Togo'],
  // Africa - Eastern
  108: ['Burundi'],
  174: ['Comoros'],
  262: ['Djibouti'],
  232: ['Eritrea'],
  231: ['Ethiopia'],
  404: ['Kenya'],
  450: ['Madagascar'],
  454: ['Malawi'],
  480: ['Mauritius'],
  508: ['Mozambique'],
  646: ['Rwanda'],
  690: ['Seychelles'],
  706: ['Somalia'],
  728: ['South Sudan'],
  800: ['Uganda'],
  834: ['Tanzania', 'United Republic of Tanzania'],
  894: ['Zambia'],
  // Africa - Middle
  24: ['Angola'],
  120: ['Cameroon'],
  140: ['Central African Republic', 'CAR'],
  148: ['Chad'],
  178: ['Republic of the Congo', 'Congo Republic', 'Congo-Brazzaville', 'Congo Brazzaville'],
  180: ['Democratic Republic of the Congo', 'DR Congo', 'DRC', 'Congo-Kinshasa', 'Congo Kinshasa'],
  226: ['Equatorial Guinea'],
  266: ['Gabon'],
  678: ['Sao Tome and Principe', 'São Tomé and Príncipe', 'Sao Tome'],
  // Africa - Southern
  72: ['Botswana'],
  426: ['Lesotho'],
  516: ['Namibia'],
  710: ['South Africa'],
  748: ['Eswatini', 'Swaziland'],
  716: ['Zimbabwe'],

  // Americas - Caribbean
  52: ['Barbados'],
  28: ['Antigua and Barbuda', 'Antigua'],
  44: ['Bahamas', 'The Bahamas'],
  192: ['Cuba'],
  212: ['Dominica'],
  214: ['Dominican Republic'],
  308: ['Grenada'],
  332: ['Haiti'],
  388: ['Jamaica'],
  659: ['Saint Kitts and Nevis', 'St Kitts and Nevis', 'St. Kitts and Nevis'],
  662: ['Saint Lucia', 'St Lucia', 'St. Lucia'],
  670: ['Saint Vincent and the Grenadines', 'St Vincent', 'St. Vincent and the Grenadines', 'Saint Vincent'],
  780: ['Trinidad and Tobago', 'Trinidad'],
  // Americas - Central
  84: ['Belize'],
  188: ['Costa Rica'],
  222: ['El Salvador'],
  320: ['Guatemala'],
  340: ['Honduras'],
  484: ['Mexico'],
  558: ['Nicaragua'],
  591: ['Panama'],
  // Americas - South
  32: ['Argentina'],
  68: ['Bolivia'],
  76: ['Brazil'],
  152: ['Chile'],
  170: ['Colombia'],
  218: ['Ecuador'],
  328: ['Guyana'],
  600: ['Paraguay'],
  604: ['Peru'],
  740: ['Suriname'],
  858: ['Uruguay'],
  862: ['Venezuela'],
  // Americas - Northern
  124: ['Canada'],
  840: ['United States', 'USA', 'US', 'United States of America', 'America'],

  // Asia - Central
  398: ['Kazakhstan'],
  417: ['Kyrgyzstan'],
  762: ['Tajikistan'],
  795: ['Turkmenistan'],
  860: ['Uzbekistan'],
  // Asia - Eastern
  156: ['China', "People's Republic of China"],
  392: ['Japan'],
  408: ['North Korea', "Democratic People's Republic of Korea", 'DPRK'],
  410: ['South Korea', 'Republic of Korea', 'Korea'],
  496: ['Mongolia'],
  158: ['Taiwan', 'Republic of China'],
  // Asia - South-eastern
  96: ['Brunei', 'Brunei Darussalam'],
  116: ['Cambodia'],
  360: ['Indonesia'],
  418: ['Laos', "Lao People's Democratic Republic"],
  458: ['Malaysia'],
  104: ['Myanmar', 'Burma'],
  608: ['Philippines'],
  702: ['Singapore'],
  764: ['Thailand'],
  704: ['Vietnam', 'Viet Nam'],
  626: ['Timor-Leste', 'East Timor'],
  // Asia - Southern
  4: ['Afghanistan'],
  50: ['Bangladesh'],
  64: ['Bhutan'],
  356: ['India'],
  364: ['Iran', 'Islamic Republic of Iran'],
  462: ['Maldives'],
  524: ['Nepal'],
  586: ['Pakistan'],
  144: ['Sri Lanka'],
  // Asia - Western
  51: ['Armenia'],
  31: ['Azerbaijan'],
  48: ['Bahrain'],
  196: ['Cyprus'],
  268: ['Georgia'],
  368: ['Iraq'],
  376: ['Israel'],
  400: ['Jordan'],
  414: ['Kuwait'],
  422: ['Lebanon'],
  275: ['Palestine', 'State of Palestine', 'Palestinian Territories'],
  512: ['Oman'],
  634: ['Qatar'],
  682: ['Saudi Arabia'],
  760: ['Syria', 'Syrian Arab Republic'],
  792: ['Turkey', 'Türkiye', 'Turkiye'],
  784: ['United Arab Emirates', 'UAE'],
  887: ['Yemen'],

  // Europe - Eastern
  112: ['Belarus'],
  100: ['Bulgaria'],
  203: ['Czech Republic', 'Czechia'],
  348: ['Hungary'],
  616: ['Poland'],
  498: ['Moldova', 'Republic of Moldova'],
  642: ['Romania'],
  643: ['Russia', 'Russian Federation'],
  703: ['Slovakia'],
  804: ['Ukraine'],
  // Europe - Northern
  208: ['Denmark'],
  233: ['Estonia'],
  246: ['Finland'],
  352: ['Iceland'],
  372: ['Ireland'],
  428: ['Latvia'],
  440: ['Lithuania'],
  578: ['Norway'],
  752: ['Sweden'],
  826: ['United Kingdom', 'UK', 'Great Britain', 'Britain'],
  // Europe - Southern
  8: ['Albania'],
  20: ['Andorra'],
  70: ['Bosnia and Herzegovina', 'Bosnia'],
  191: ['Croatia'],
  470: ['Malta'],
  300: ['Greece'],
  380: ['Italy'],
  807: ['North Macedonia', 'Macedonia'],
  499: ['Montenegro'],
  620: ['Portugal'],
  674: ['San Marino'],
  688: ['Serbia'],
  705: ['Slovenia'],
  724: ['Spain'],
  336: ['Vatican City', 'Holy See', 'Vatican'],
  // Europe - Western
  40: ['Austria'],
  56: ['Belgium'],
  250: ['France'],
  276: ['Germany'],
  438: ['Liechtenstein'],
  442: ['Luxembourg'],
  492: ['Monaco'],
  528: ['Netherlands', 'Holland'],
  756: ['Switzerland'],
  383: ['Kosovo'],

  // Oceania - Australia and NZ
  36: ['Australia'],
  554: ['New Zealand'],
  // Oceania - Melanesia
  242: ['Fiji'],
  598: ['Papua New Guinea', 'PNG'],
  90: ['Solomon Islands'],
  548: ['Vanuatu'],
  // Oceania - Micronesia
  296: ['Kiribati'],
  584: ['Marshall Islands'],
  583: ['Micronesia', 'Federated States of Micronesia', 'FSM'],
  520: ['Nauru'],
  585: ['Palau'],
  // Oceania - Polynesia
  882: ['Samoa'],
  776: ['Tonga'],
  798: ['Tuvalu']
};

// Microstates that may lack polygons in 50m TopoJSON — render as circle markers
// [longitude, latitude]
export const MICROSTATE_COORDS = {
  336: [12.4534, 41.9029],     // Vatican City
  492: [7.4167, 43.7333],      // Monaco
  674: [12.4578, 43.9424],     // San Marino
  438: [9.5215, 47.1660],      // Liechtenstein
  20: [1.5218, 42.5063],       // Andorra
  48: [50.5577, 26.0667],      // Bahrain
  702: [103.8198, 1.3521],     // Singapore
  480: [57.5522, -20.3484],    // Mauritius
  174: [43.3333, -11.6455],    // Comoros
  690: [55.4500, -4.6167],     // Seychelles
  462: [73.5109, 4.1755],      // Maldives
  678: [6.6131, 0.1864],       // Sao Tome and Principe
  28: [-61.7964, 17.0608],     // Antigua and Barbuda
  212: [-61.3710, 15.4150],    // Dominica
  308: [-61.6790, 12.1165],    // Grenada
  659: [-62.7830, 17.3578],    // Saint Kitts and Nevis
  662: [-60.9789, 13.9094],    // Saint Lucia
  670: [-61.2872, 12.9843],    // Saint Vincent
  296: [173.0000, 1.4167],     // Kiribati
  584: [171.1845, 7.1315],     // Marshall Islands
  583: [158.2150, 6.8874],     // Micronesia
  520: [166.9315, -0.5228],    // Nauru
  585: [134.4795, 7.5150],     // Palau
  882: [-172.1046, -13.7590],  // Samoa
  776: [-175.1982, -21.1790],  // Tonga
  780: [-61.2225, 10.4438],    // Trinidad and Tobago
  242: [178.0650, -17.7134],   // Fiji
  96: [114.7277, 4.9431],       // Brunei
  52: [-59.5432, 13.1939],     // Barbados
  470: [14.3754, 35.9375],     // Malta
  383: [20.9020, 42.6026],     // Kosovo
  798: [179.1940, -8.5199],    // Tuvalu
};

// Build a lookup: countryId → regionName
const _countryRegionMap = new Map();
for (const [regionName, regionData] of Object.entries(REGIONS)) {
  for (const ids of Object.values(regionData.subregions)) {
    for (const id of ids) {
      _countryRegionMap.set(id, regionName);
    }
  }
}

/**
 * Get the region name for a country ID
 */
export function getRegion(countryId) {
  return _countryRegionMap.get(countryId) || null;
}

/**
 * Get canonical (display) name for a country
 */
export function getDisplayName(countryId) {
  const aliases = COUNTRY_ALIASES[countryId];
  return aliases ? aliases[0] : null;
}

/**
 * Get all quizzable country IDs
 */
export function getAllCountryIds() {
  return Object.keys(COUNTRY_ALIASES).map(Number);
}

/**
 * Normalize a string for comparison: lowercase, trim, strip diacritics
 */
function normalize(str) {
  return str
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[''`]/g, "'")
    .replace(/[-–—]/g, ' ')
    .replace(/\./g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Check if userInput matches the country with given ID
 */
export function checkAnswer(countryId, userInput) {
  const aliases = COUNTRY_ALIASES[countryId];
  if (!aliases) return false;
  const normalizedInput = normalize(userInput);
  if (!normalizedInput) return false;
  return aliases.some(alias => normalize(alias) === normalizedInput);
}

/**
 * Build the list of quizzable countries from TopoJSON features.
 * Returns { polygonCountries: Map<id, feature>, microstateIds: number[] }
 */
export function buildQuizzableList(geoFeatures) {
  const allIds = new Set(getAllCountryIds());
  const polygonCountries = new Map();
  const featureIdSet = new Set();

  for (const feature of geoFeatures) {
    const id = Number(feature.id);
    featureIdSet.add(id);
    if (allIds.has(id)) {
      polygonCountries.set(id, feature);
    }
  }

  // Microstates: countries in MICROSTATE_COORDS always get circle markers
  // (their polygons may exist but are too small to click reliably)
  const microstateIds = [];
  for (const idStr of Object.keys(MICROSTATE_COORDS)) {
    const id = Number(idStr);
    if (allIds.has(id)) {
      microstateIds.push(id);
    }
  }

  return { polygonCountries, microstateIds };
}

/**
 * Get all unguessed country names with their IDs for autocomplete
 */
export function getCountryNamesForAutocomplete(guessedIds) {
  const results = [];
  for (const [idStr, aliases] of Object.entries(COUNTRY_ALIASES)) {
    const id = Number(idStr);
    if (guessedIds.has(id)) continue;
    results.push({
      id,
      name: aliases[0],
      region: getRegion(id) || ''
    });
  }
  results.sort((a, b) => a.name.localeCompare(b.name));
  return results;
}
