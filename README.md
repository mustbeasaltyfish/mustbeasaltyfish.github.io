# Personal Website

一个基于 React + TypeScript + Tailwind CSS 构建的个人网站项目。

## Macintosh 主页

主页仅展示一台居中的 Macintosh，所有内容与导航都在屏幕内。外观以初代 Macintosh 为灵感：带贴纸白边与材质阴影的米色机身，屏幕内运行可交互的黑白桌面。机身使用 CSS 绘制，像素图标和光标使用 SVG，不依赖 WebGL 或外部图片服务。

- 点击桌面图标打开欢迎、个人介绍、思考、友人或联系方式；点击窗口左上角关闭。
- 拖动窗口标题栏可移动窗口，范围限制在屏幕内；触屏端保留点击和滚动。
- 欢迎窗口通过 `Enter desktop` 明确提示进入全屏桌面，状态栏也保留入口；点击窗口右上角或 `View > Expand screen` 也可进入，按 Escape 返回。全屏默认窗口占据桌面的主要区域。
- `About me` 保留原版七个性格图标的两秒轮播，使用黑白像素图标和阶梯切换；可暂停、手动切换，并遵守系统的减少动态效果设置。
- `Special > Restart` 重放开机过程；机身右下角的指示灯可休眠，点击屏幕唤醒。
- `Ask Starry` 继续使用现有 Bot 服务和客户端限流，需要沿用下文的 API 配置。
- `Contact` 提供 GitHub 链接、邮件链接和微信号复制。
- 思考、友人仍是待建设页面；字体均随项目本地加载，授权见 `Attributions.md`。

实现按职责分开：`src/components/mac/Macintosh.tsx` 管理机身、开机和屏幕放大；`Desktop.tsx` 管理菜单与窗口；`WindowContent.tsx` 放置页面内容和 Bot 表单；`Personality.tsx` 管理性格图标轮播；`PixelIcon.tsx` 提供像素图标；`AppleLogo.tsx` 复用 Apple 标志轮廓；`src/styles/macintosh-hardware.css` 管理机身与居中舞台；`src/styles/macintosh.css` 管理屏幕内的桌面与响应式布局。

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
- https://mustbeasaltyfish.github.io/

## 图片资源

头像位于 `src/assets/images/avatar.jpg`，由 `src/components/mac/WindowContent.tsx` 引用。机身、键盘和鼠标由 CSS 绘制；桌面图标为项目内 SVG；像素光标位于 `src/assets/images/mac-arrow.svg` 和 `mac-text.svg`。

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
