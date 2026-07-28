# Atlas

一个仓库托管多个独立静态项目，并统一发布到 GitHub Pages。

## 目录约定

```text
projects/
  demo/             # https://<user>.github.io/atlas/demo/
  another-project/  # https://<user>.github.io/atlas/another-project/
```

`projects/` 下的每个一级文件夹都是独立项目，文件夹名就是线上路径。构建时会自动生成站点根目录的项目入口页。

## 添加纯静态项目

复制 `projects/demo/`，保证新目录里有 `index.html`。可选的 `project.json` 用于配置入口页展示信息：

```json
{
  "title": "项目名称",
  "description": "项目简介"
}
```

HTML 中请优先使用相对资源路径（例如 `./style.css`），避免使用从域名根目录开始的 `/style.css`。

## 添加需要构建的项目

项目目录内放置 `package.json`，并提供 `build` 脚本。默认发布该项目的 `dist/` 目录：

```json
{
  "private": true,
  "scripts": {
    "build": "vite build"
  }
}
```

若产物目录不是 `dist/`，可声明：

```json
{
  "atlas": {
    "title": "项目名称",
    "output": "build"
  }
}
```

构建脚本会向每个项目传入 `BASE_PATH`，值为 `/<仓库名>/<项目目录名>/`。Vite 等工具应使用它配置部署基础路径。

## 本地预览

```bash
npm run build
npm run preview
```

打开终端提示的地址。不要直接双击 `dist/index.html`，因为部分项目可能依赖 HTTP 路由行为。

## 发布

1. 把仓库推送到 GitHub，默认分支保持为 `main`。
2. 在仓库 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。
3. 推送到 `main`，或在 Actions 页面手动运行 `Deploy static projects to Pages`。

项目仓库的默认地址是 `https://<user>.github.io/<仓库名>/`。若仓库名为 `<user>.github.io`，则站点直接位于域名根目录。
