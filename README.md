# Skrida

Skrida is a filterable and sortable table of all registered findings from the archaeological excavation at Skriðuklaustur.

The goal of the project is to make this excavation data available to anyone who is curious, while also supporting the mobile game experience played at the Skriðuklaustur exhibition and monastery excavation site.

## What The App Does

- Displays excavation findings in a data table.
- Supports column-based filtering and global search.
- Supports sorting and expandable row details.
- Loads data from a static JSON file included in the app build.

## Data Source

- Main data file: `src/assets/munaskra.json`
- The data is bundled into the build output under `assets/munaskra.json`.

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Open:

```text
http://localhost:4200/
```

## Build

Create a production build:

```bash
npm run build
```

Build artifacts are generated in the `dist/` directory.

## Test

Run unit tests:

```bash
npm test
```
