# World Map Quiz

Interactive geography quiz — click countries on an SVG map and name them.

**Live:** https://liaowill.com/map_quiz/

## Features

- 197 quizzable countries (193 UN members + Vatican City, Palestine, Taiwan, Kosovo)
- D3.js Natural Earth projection with zoom/pan
- Configurable lives (3/5/10/unlimited) and time limit
- Autocomplete input with region hints
- Regional progress tracking sidebar
- Tooltip on guessed countries
- Press **R** to randomly select and zoom to an unguessed country

## Local Development

Requires a local server due to ES modules:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Deployment

The site is hosted on AWS (S3 + CloudFront) and served via a Cloudflare Worker at `liaowill.com/map_quiz/`.

To deploy changes:

```bash
./deploy.sh
```

This syncs files to S3 and invalidates the CloudFront cache. Requires AWS CLI configured with appropriate credentials.

### Infrastructure

- **S3 bucket:** `liaowill-map-quiz` (us-east-1)
- **CloudFront distribution:** `E3EULTR53TJOJS` (`d7ljhxjl628cb.cloudfront.net`)
- **Cloudflare Worker:** `map-quiz-proxy` — proxies `/map_quiz/*` to CloudFront

## Tech Stack

- Vanilla JS (ES modules, no build step)
- D3.js v7 + TopoJSON Client v3
- Map data: `world-atlas@2/countries-50m.json` from jsDelivr CDN
