import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const projectsRoot = path.join(root, "projects");
const outputRoot = path.join(root, "dist");
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/").pop() ?? "";
const siteBase = repositoryName && !repositoryName.endsWith(".github.io")
  ? `/${repositoryName}`
  : "";

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);

const readJson = async (file) => JSON.parse(await readFile(file, "utf8"));

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

const entries = (await readdir(projectsRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
  .sort((a, b) => a.name.localeCompare(b.name));

const projects = [];

for (const entry of entries) {
  const slug = entry.name;
  const projectRoot = path.join(projectsRoot, slug);
  const packageFile = path.join(projectRoot, "package.json");
  const metadataFile = path.join(projectRoot, "project.json");
  let packageJson = {};
  let metadata = {};
  let sourceRoot = projectRoot;

  if (existsSync(packageFile)) {
    packageJson = await readJson(packageFile);

    if (packageJson.scripts?.build) {
      const installArgs = existsSync(path.join(projectRoot, "package-lock.json"))
        ? ["ci"]
        : ["install"];
      const install = spawnSync("npm", installArgs, {
        cwd: projectRoot,
        stdio: "inherit",
        env: process.env
      });
      if (install.status !== 0) process.exit(install.status ?? 1);

      const build = spawnSync("npm", ["run", "build"], {
        cwd: projectRoot,
        stdio: "inherit",
        env: {
          ...process.env,
          BASE_PATH: `${siteBase}/${slug}/`
        }
      });
      if (build.status !== 0) process.exit(build.status ?? 1);

      sourceRoot = path.join(projectRoot, packageJson.atlas?.output ?? "dist");
    }
  }

  if (existsSync(metadataFile)) metadata = await readJson(metadataFile);
  if (!existsSync(path.join(sourceRoot, "index.html"))) {
    throw new Error(`${slug} 没有可发布的 index.html：${sourceRoot}`);
  }

  const targetRoot = path.join(outputRoot, slug);
  await mkdir(targetRoot, { recursive: true });
  await cp(sourceRoot, targetRoot, {
    recursive: true,
    filter: (source) => {
      if (sourceRoot !== projectRoot) return true;
      const relative = path.relative(projectRoot, source);
      return !["node_modules", "dist", "build", "package.json", "package-lock.json", "project.json"]
        .some((ignored) => relative === ignored || relative.startsWith(`${ignored}${path.sep}`));
    }
  });

  projects.push({
    slug,
    title: metadata.title ?? packageJson.atlas?.title ?? packageJson.name ?? slug,
    description: metadata.description ?? packageJson.description ?? ""
  });
  console.log(`✓ ${slug} -> dist/${slug}`);
}

const cards = projects.map((project) => `
      <a class="card" href="./${encodeURIComponent(project.slug)}/">
        <span class="arrow">↗</span>
        <h2>${escapeHtml(project.title)}</h2>
        <p>${escapeHtml(project.description || "打开项目")}</p>
        <code>/${escapeHtml(project.slug)}/</code>
      </a>`).join("");

const indexHtml = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <title>Atlas</title>
  <style>
    :root { font-family: Inter, ui-sans-serif, system-ui, sans-serif; color: #f5f5f5; background: #0b0d10; }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; background: radial-gradient(circle at 15% 0%, #24304a 0, transparent 35rem), #0b0d10; }
    main { width: min(1080px, calc(100% - 40px)); margin: auto; padding: 96px 0; }
    header { margin-bottom: 52px; }
    .eyebrow { color: #8ba8ff; font-size: 13px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; }
    h1 { margin: 12px 0 14px; font-size: clamp(42px, 8vw, 82px); letter-spacing: -.06em; line-height: .95; }
    header p { max-width: 600px; color: #a8adb7; font-size: 18px; line-height: 1.65; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; }
    .card { position: relative; min-height: 220px; padding: 28px; border: 1px solid #2a2f39; border-radius: 22px; color: inherit; text-decoration: none; background: rgba(21, 24, 30, .82); transition: .2s ease; }
    .card:hover { transform: translateY(-4px); border-color: #6f8ee8; background: #191e28; }
    .card h2 { margin: 38px 0 10px; font-size: 25px; }
    .card p { margin: 0 0 24px; color: #a8adb7; line-height: 1.55; }
    .card code { position: absolute; bottom: 25px; color: #8ba8ff; }
    .arrow { position: absolute; top: 24px; right: 26px; color: #8ba8ff; font-size: 22px; }
    .empty { color: #a8adb7; padding: 28px; border: 1px dashed #343943; border-radius: 22px; }
  </style>
</head>
<body>
  <main>
    <header>
      <div class="eyebrow">Static project collection</div>
      <h1>Atlas</h1>
      <p>这里收录了仓库中的所有独立静态项目。每个项目独立构建，通过同一个 GitHub Pages 站点访问。</p>
    </header>
    <section class="grid">${cards || '<div class="empty">还没有项目。</div>'}
    </section>
  </main>
</body>
</html>`;

await writeFile(path.join(outputRoot, "index.html"), indexHtml);
await writeFile(path.join(outputRoot, ".nojekyll"), "");
console.log(`✓ 入口页 -> dist/index.html（${projects.length} 个项目）`);
