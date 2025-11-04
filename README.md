# Personal Website

一个基于 React + TypeScript + Tailwind CSS 构建的个人网站项目。

## 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架
- **Framer Motion** - 动画库
- **shadcn/ui** - UI 组件库
- **Lucide React** - 图标库

## 项目结构

```
Personal_web/
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # React 组件
│   │   ├── figma/       # Figma 相关组件
│   │   └── ui/          # UI 组件库
│   ├── styles/          # 样式文件
│   ├── App.tsx         # 主应用组件
│   └── main.tsx        # 应用入口
├── .github/
│   └── workflows/      # GitHub Actions 工作流
├── public/             # 公共资源
├── index.html          # HTML 入口
├── vite.config.ts      # Vite 配置
├── tsconfig.json       # TypeScript 配置
├── tailwind.config.js  # Tailwind 配置
└── package.json        # 项目配置
```

## 开发

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 部署到 GitHub Pages

### 自动部署

项目已配置 GitHub Actions 工作流，当你推送代码到 `main` 分支时，会自动构建并部署到 GitHub Pages。

### 手动部署

1. 确保 GitHub Pages 已启用（Settings > Pages）
2. 构建项目：
   ```bash
   npm run build:gh-pages
   ```
3. 将 `dist/` 目录的内容推送到 `gh-pages` 分支

### 访问网站

部署成功后，网站将可通过以下地址访问：
- https://wuyukai.github.io/Personal_web/

## 图片资源

当前项目使用占位符图片。要使用实际的 Figma 设计资源：

1. 从 Figma 导出头像图片
2. 将图片保存到 `src/assets/images/` 目录
3. 更新 `src/App.tsx` 中的导入路径

原始 Figma 资源 ID: `e61f386b2c2ac454de982581bf3b2dad6dceffa4`

## Bot 功能配置

项目集成了人格 Bot 功能，使用硅基流动 API。

### 重要说明

由于 GitHub Pages 是静态网站托管服务，无法在运行时访问服务器端的环境变量或 Secrets。API Key 必须在**构建时**打包到代码中。这意味着：

✅ **部署到 GitHub Pages 后，所有访问者都可以使用 Bot 功能**（这是您期望的行为）  
⚠️ **API Key 会被嵌入到前端代码中**（虽然不直接可见，但技术人员可以提取）  
💡 **建议使用限流和配额控制**来防止滥用

### 配置步骤

#### 1. 本地开发配置

1. 复制 `.env.example` 为 `.env`：
   ```bash
   cp .env.example .env
   ```

2. 在 `.env` 文件中填入你的硅基流动 API Key：
   ```
   VITE_SILICONFLOW_API_KEY=your_api_key_here
   ```

3. 保持 `src/config/deploy.ts` 中的 `IS_GITHUB_PAGES = 0`：
   ```typescript
   export const IS_GITHUB_PAGES = 0;  // 本地开发
   ```

#### 2. GitHub Pages 部署配置

1. **配置 GitHub Secret**：
   - 进入仓库的 Settings > Secrets and variables > Actions
   - 点击 "New repository secret"
   - Name: `SILICONFLOW_API_KEY`
   - Value: 你的硅基流动 API Key
   - 点击 "Add secret"

2. **修改部署标志**：
   - 打开 `src/config/deploy.ts`
   - 将 `IS_GITHUB_PAGES` 改为 `1`：
     ```typescript
     export const IS_GITHUB_PAGES = 1;  // 准备部署到 GitHub Pages
     ```

3. **提交并推送**：
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

4. **等待自动部署完成**（约 2-3 分钟）

#### 3. 工作原理

```mermaid
本地开发:
  .env 文件 → VITE_SILICONFLOW_API_KEY → 构建 → 本地预览

GitHub Pages 部署:
  GitHub Secret → GitHub Actions → VITE_SILICONFLOW_API_KEY → 构建 → 静态文件 → GitHub Pages
                                                                   ↓
                                                            (API Key 已打包在代码中)
                                                                   ↓
                                                            访问者可以使用 Bot 功能
```

**关键点**：
- `IS_GITHUB_PAGES` 标志用于区分环境，提供不同的错误提示
- 无论本地还是 GitHub Pages，API Key 都是在**构建时**通过 `import.meta.env.VITE_SILICONFLOW_API_KEY` 注入
- 本地：从 `.env` 文件读取
- GitHub Pages：从 GitHub Actions 环境变量读取（来自 Secret）

## 开发注意事项

- 使用 TypeScript 确保类型安全
- 遵循 Tailwind CSS 最佳实践
- 组件使用 shadcn/ui 设计系统
- 动画使用 Framer Motion (motion/react)

## 许可证

MIT License

