<!-- @format -->

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Commit Conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for standardized commit messages. Commit messages are enforced using commitlint and husky.

### Commit Message Format

Each commit message consists of a **header**, a **body**, and a **footer**. The header has a special format that includes a **type**, an optional **scope**, and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

#### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to our CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

#### Examples

```
feat(auth): add login functionality
fix(dashboard): resolve data loading issue
docs(readme): update installation instructions
```

# Prompt Speaker

一个基于Electron的语音识别和转录应用程序，使用Google Speech-to-Text API进行实时语音转文字处理。

## 功能特点

- 实时语音识别和转录
- gRPC流式传输支持
- 录音和播放功能
- 转录结果优化和编辑
- 支持多语言（目前默认为中文）

## 技术栈

- Electron: 跨平台桌面应用开发框架
- React + TypeScript: 前端界面开发
- MobX: 状态管理
- Google Cloud Speech-to-Text API: 语音识别服务
- tailwindcss: UI样式

## 开发环境设置

### 前提条件

- Node.js (v18+)
- npm 或 yarn
- Google Cloud 账户和 Speech-to-Text API 访问权限

### 安装依赖

```bash
npm install
```

### 配置Google Cloud凭证

1. 创建一个Google Cloud项目并启用Speech-to-Text API
2. 创建一个服务账户并下载JSON密钥文件
3. 将JSON密钥文件重命名为`gen-lang-client-0315203804-8c8844577471.json`（或修改`SpeechToTextService.ts`中的路径）
4. 将JSON密钥文件放在项目根目录下

### gRPC配置

本项目使用gRPC而不是REST API来支持流式传输功能。确保以下事项：

1. 已安装所需的gRPC依赖：

   ```bash
   npm install @grpc/grpc-js @grpc/proto-loader
   ```

2. 对于macOS和Windows用户可能需要安装额外的构建工具：

   - macOS: `xcode-select --install`
   - Windows: `npm install --global --production windows-build-tools`

3. 如果遇到gRPC相关错误，请尝试重新安装依赖：
   ```bash
   npm rebuild
   ```

### 启动开发服务器

```bash
npm run dev
```

## 打包应用

```bash
npm run build
```

## 许可证

MIT
