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

## 开发注意事项

- 使用 TypeScript 确保类型安全
- 遵循 Tailwind CSS 最佳实践
- 组件使用 shadcn/ui 设计系统
- 动画使用 Framer Motion (motion/react)

## 许可证

MIT License

