# Getting Started with React & Vite

Follow these steps to set up a new React project using Vite:

## 1. Prerequisites

- [Node.js](https://nodejs.org/) (v14.18+, v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 2. Create a New Project

```bash
npm create vite@latest afriremit -- --template react
# OR using yarn
yarn create vite afriremit --template react
```

## 3. Navigate to Project Directory

```bash
cd afriremit
```

## 4. Install Dependencies

```bash
npm install
# OR
yarn
```

## 5. Start the Development Server

```bash
npm run dev
# OR
yarn dev
```

- Open [http://localhost:5173](http://localhost:5173) in your browser to view the app.

## 6. Project Structure

```
afriremit/
├─ node_modules/
├─ public/
├─ src/
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ ...
├─ index.html
├─ package.json
├─ vite.config.js
└─ ...
```

## 7. Build for Production

```bash
npm run build
# OR
yarn build
```

## 8. Preview Production Build

```bash
npm run preview
# OR
yarn preview
```

---

For more details, see the [Vite documentation](https://vitejs.dev/guide/) and [React documentation](https://react.dev/).
