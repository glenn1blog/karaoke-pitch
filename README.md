# React + TypeScript + Vite

這個範本提供最小化的設定，讓 React 能在 Vite 中啟動，並附有 HMR 與基本的 ESLint 規則。

官方目前提供兩個 React 插件：

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) 使用 [Babel](https://babeljs.io/)（若搭配 [rolldown-vite](https://vite.dev/guide/rolldown) 則可使用 [oxc](https://oxc.rs)）支援 Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) 使用 [SWC](https://swc.rs/) 支援 Fast Refresh

## React Compiler

此範本預設未啟用 React Compiler，以避免影響開發與建置效能。若需要，可參考[官方文件](https://react.dev/learn/react-compiler/installation)自行加入。

## 擴充 ESLint 設定

若是開發正式環境的應用程式，建議啟用 type-aware 的 lint 規則，設定範例如下：

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // 其他共用設定...

      // 將 tseslint.configs.recommended 換成下列設定
      tseslint.configs.recommendedTypeChecked,
      // 若希望更嚴格，可改用這個
      tseslint.configs.strictTypeChecked,
      // 若需要風格相關的規則，可加入這個
      tseslint.configs.stylisticTypeChecked,

      // 其他共用設定...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // 其他選項...
    },
  },
])
```

也可以安裝 [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) 與 [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) 來啟用更完整的 React 相關規則：

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // 其他共用設定...
      // React 規則
      reactX.configs['recommended-typescript'],
      // React DOM 規則
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // 其他選項...
    },
  },
])
```
