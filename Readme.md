# NFT Marketplace

## Folder Structure

- **backend**: Contains server-side code.
- **lib**: Contains shared package along with project.
- **webapp**: Contains client-side code.

## Prerequisites

Ensure you have the following installed:

- Node.js version 18+
- pnpm version 8.12+

## Installation

```bash
# Install dependencies for the entire project
pnpm install
```

### Install a package specific to backend:

```bash
pnpm install package_name --filter=backend
```

### Install a package specific to webapp:

```bash
pnpm install package_name --filter=webapp
```

### Start Project (Development Mode)

## For Client Side Webapp

Navigate to the native directory and run:

```bash
pnpm -F webapp dev
```

### Start Project (Production Mode)

## For Client Side Webapp

Navigate to the native directory and run:

```bash
pnpm -F webapp build
```

## For Backend

Navigate to the backend directory and run:

```bash
pnpm -F backend build
pm2 restart all
```

if start first time

```bash
pm2 start process.json
```
