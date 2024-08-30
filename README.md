# Thought Process

- **Data**: the moment I read the google doc, I knew the data would be a big problem so I started looking for mock data everywhere like spotify, youtube stats, etc but didn't get any success. So, I thought of creating mock data on some website like mockaroo. Problem with these websites was that not really great song mock data was there. So finally, I thought of using faker on local to create data. And everything was just great with this way. 

- **UI Library**: I have used Shadcn for many projects now so it was the obvious choice. Using tailwindCSS is also an obvious choice for me because of its ease to use.

- **Features**: Apart from Cards, Graphs and Data table, I though of giving users a Date range picker to show data accordingly. Also, some additional things in data table.

- **State Management**: I used Context for state management.

# How to run

- Clone the repo `https://github.com/shoaibh/streamify.git`
- Install the dependencies with `npm i` (or `pnpm i` which I used for the assignment)
- Run the project with `npm run dev`
- the project will run locally on `http://localhost:5173/`


# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
