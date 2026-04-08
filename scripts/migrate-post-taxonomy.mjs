import fs from "fs";
import path from "path";
import yaml from "js-yaml";

const projectRoot = path.resolve("E:/Tools/blog/Twilight");
const postsRoot = path.join(projectRoot, "src/content/posts");

const moveSpecs = [
  { source: "成长日记/开发工具/git", destination: "软件工具/Git", kind: "dir", category: "软件工具/Git" },
  { source: "成长日记/开发工具/nodejs", destination: "软件工具/Node.js", kind: "dir", category: "软件工具/Node.js" },
  { source: "成长日记/编程语言/CPP", destination: "编程语言/C++", kind: "dir", category: "编程语言/C++" },
  { source: "成长日记/编程语言/Python", destination: "编程语言/Python", kind: "dir", category: "编程语言/Python" },
  { source: "成长日记/编程语言/Rust", destination: "编程语言/Rust", kind: "dir", category: "编程语言/Rust" },
  { source: "成长日记/Linux/wsl.md", destination: "系统与网络/Linux/wsl.md", kind: "file", category: "系统与网络/Linux" },
  { source: "成长日记/Linux/tmux.md", destination: "系统与网络/Linux/tmux.md", kind: "file", category: "系统与网络/Linux" },
  { source: "成长日记/Linux/partition-expand", destination: "系统与网络/Linux/partition-expand", kind: "dir", category: "系统与网络/Linux" },
  { source: "成长日记/Linux/remote ssh set proxy.md", destination: "系统与网络/代理/remote-ssh-set-proxy.md", kind: "file", category: "系统与网络/代理" },
  { source: "成长日记/远程连接/vscode-ssh", destination: "系统与网络/SSH/vscode-ssh", kind: "dir", category: "系统与网络/SSH" },
  { source: "成长日记/远程连接/frp.md", destination: "系统与网络/内网穿透/frp.md", kind: "file", category: "系统与网络/内网穿透" },
  { source: "成长日记/远程连接/passnat.md", destination: "系统与网络/内网穿透/passnat.md", kind: "file", category: "系统与网络/内网穿透" },
  { source: "成长日记/远程连接/tailscale.md", destination: "系统与网络/内网穿透/tailscale.md", kind: "file", category: "系统与网络/内网穿透" },
  { source: "成长日记/深度学习/cuda-config", destination: "机器学习/深度学习/环境配置/cuda-config", kind: "dir", category: "机器学习/深度学习/环境配置" },
  { source: "成长日记/深度学习/cuda-version-guide.md", destination: "机器学习/深度学习/环境配置/cuda-version-guide.md", kind: "file", category: "机器学习/深度学习/环境配置" },
  { source: "成长日记/深度学习/pytorch.md", destination: "机器学习/深度学习/PyTorch/pytorch.md", kind: "file", category: "机器学习/深度学习/PyTorch" },
  { source: "成长日记/深度学习/mmdet-api.md", destination: "机器学习/深度学习/MMDetection/mmdet-api.md", kind: "file", category: "机器学习/深度学习/MMDetection" },
  { source: "成长日记/深度学习/mmdet-custom.md", destination: "机器学习/深度学习/MMDetection/mmdet-custom.md", kind: "file", category: "机器学习/深度学习/MMDetection" },
  { source: "成长日记/深度学习/mmdet-mmcv.md", destination: "机器学习/深度学习/MMDetection/mmdet-mmcv.md", kind: "file", category: "机器学习/深度学习/MMDetection" },
  { source: "成长日记/深度学习/mmdet-pip-install.md", destination: "机器学习/深度学习/MMDetection/mmdet-pip-install.md", kind: "file", category: "机器学习/深度学习/MMDetection" },
  { source: "成长日记/深度学习/mmdet-train-test.md", destination: "机器学习/深度学习/MMDetection/mmdet-train-test.md", kind: "file", category: "机器学习/深度学习/MMDetection" },
  { source: "成长日记/深度学习/mmdet-registry-error", destination: "机器学习/深度学习/MMDetection/mmdet-registry-error", kind: "dir", category: "机器学习/深度学习/MMDetection" },
  { source: "科研笔记/目标检测", destination: "机器学习/深度学习/目标检测", kind: "dir", category: "机器学习/深度学习/目标检测" },
  { source: "科研笔记/论文写作/IEEE会议论文格式调整", destination: "软件工具/LaTeX/IEEE会议论文格式调整", kind: "dir", category: "软件工具/LaTeX" },
  { source: "成长日记/计算机知识/竞态条件的形成.md", destination: "计算机基础/操作系统/并发控制/竞态条件的形成.md", kind: "file", category: "计算机基础/操作系统/并发控制" }
];

const tagMap = new Map([
  ["ssh", "SSH"],
  ["proxy", "代理"],
  ["Pull Request", "PR"]
]);

function normalizeSlash(filePath) {
  return filePath.replace(/\\/g, "/");
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function moveEntry(sourceRel, destinationRel) {
  const sourceAbs = path.join(postsRoot, sourceRel);
  const destinationAbs = path.join(postsRoot, destinationRel);

  if (!fs.existsSync(sourceAbs)) {
    throw new Error(`Missing source: ${sourceRel}`);
  }
  if (fs.existsSync(destinationAbs)) {
    throw new Error(`Destination already exists: ${destinationRel}`);
  }

  ensureDir(path.dirname(destinationAbs));
  fs.renameSync(sourceAbs, destinationAbs);
}

function walkMarkdownFiles(dirPath) {
  const files = [];
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(fullPath));
      continue;
    }
    if (/\.(md|mdx)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function loadFrontmatter(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(\r?\n?[\s\S]*)$/);
  if (!match) {
    throw new Error(`Frontmatter not found: ${normalizeSlash(path.relative(projectRoot, filePath))}`);
  }

  return {
    data: yaml.load(match[1]) ?? {},
    body: match[2].replace(/^\r?\n/, "")
  };
}

function dumpFrontmatter(data) {
  return yaml.dump(data, {
    lineWidth: -1,
    noRefs: true,
    quotingType: "\"",
    forceQuotes: false
  }).trimEnd();
}

function updateFrontmatter(filePath, category) {
  const { data, body } = loadFrontmatter(filePath);
  const nextData = {
    ...data,
    category,
    tags: Array.isArray(data.tags)
      ? data.tags.map((tag) => tagMap.get(tag) ?? tag)
      : []
  };

  const output = `---\n${dumpFrontmatter(nextData)}\n---\n\n${body.replace(/^\r?\n/, "")}`;
  fs.writeFileSync(filePath, output, "utf8");
}

function removeEmptyDirs(dirPath) {
  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    return;
  }

  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      removeEmptyDirs(path.join(dirPath, entry.name));
    }
  }

  if (fs.readdirSync(dirPath).length === 0) {
    fs.rmdirSync(dirPath);
  }
}

for (const spec of moveSpecs) {
  moveEntry(spec.source, spec.destination);
}

for (const spec of moveSpecs) {
  const destinationAbs = path.join(postsRoot, spec.destination);
  const markdownFiles = spec.kind === "dir" ? walkMarkdownFiles(destinationAbs) : [destinationAbs];
  for (const filePath of markdownFiles) {
    updateFrontmatter(filePath, spec.category);
  }
}

removeEmptyDirs(path.join(postsRoot, "成长日记"));
removeEmptyDirs(path.join(postsRoot, "科研笔记"));

console.log("Post taxonomy migration completed.");
