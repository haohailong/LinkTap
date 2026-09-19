<a id="top"></a>

<p align="center">
  <img src="assets/icons/icon128.png" width="112" height="112" alt="LinkTap Logo">
</p>

<h1 align="center">LinkTap</h1>

<p align="center">
  <strong>Chrome Extension · Chrome 浏览器扩展</strong><br>
  按住自定义修饰键，点击即可复制链接。<br>
  <sub>Modifier-click any link to copy its URL without opening it.</sub>
</p>

<p align="center">
  <a href="#zh-cn">简体中文</a>
  ·
  <a href="#english">English</a>
</p>

<p align="center">
  <a href="https://github.com/haohailong/LinkTap/releases/latest"><img alt="Version 2.0.2" src="https://img.shields.io/badge/version-2.0.2-1744e8?style=flat-square"></a>
  <img alt="Manifest V3" src="https://img.shields.io/badge/Chrome-Manifest_V3-34a853?style=flat-square&logo=googlechrome&logoColor=white">
  <img alt="5 languages" src="https://img.shields.io/badge/languages-5-7c3aed?style=flat-square">
  <a href="LICENSE"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-f59e0b?style=flat-square"></a>
</p>

<!-- release-sha256:start -->
<p align="center">
  <strong>v2.0.2 · SHA-256 (LinkTap.zip)</strong><br>
  <code>0de9ae2828e099020812f93f1f6d3203ebc1de21114345700855c04ac08b4dbe</code><br>
  <a href="https://github.com/haohailong/LinkTap/releases/latest/download/LinkTap.zip.sha256">校验文件 / Checksum file</a>
</p>
<!-- release-sha256:end -->

<p align="center">
  <a href="https://github.com/haohailong/LinkTap/releases/latest/download/LinkTap.zip"><strong>直接下载 / Direct download</strong></a>
  ·
  <a href="https://haohailong.github.io/LinkTap/">网站 / Website</a>
  ·
  <a href="https://github.com/haohailong/LinkTap/releases/latest">发布说明 / Release notes</a>
  ·
  <a href="CHANGELOG.md">更新记录 / Changelog</a>
  ·
  <a href="PRIVACY.md">隐私 / Privacy</a>
  ·
  <a href="SECURITY.md">安全 / Security</a>
</p>

---

<a id="zh-cn"></a>

## 简体中文

### 功能

- 按住一个或多个修饰键并点击链接，立即复制完整 URL。
- 自由组合 Ctrl / Control、Alt / Option、Shift、Meta / Command。
- 精确匹配快捷键，避免误触。
- 阻止链接跳转、新标签页打开及 Option + 点击下载等默认行为。
- 兼容 macOS 的 Control + 点击及四修饰键组合。
- 设置自动保存，并可通过浏览器工具栏随时启用或暂停。
- 自动跟随 Chrome 界面语言。

### 支持语言

English、简体中文、繁體中文、日本語、한국어。不在列表中的语言会自动使用英语。

### 安装

1. 打开 [Releases](https://github.com/haohailong/LinkTap/releases/latest)。
2. 下载 `LinkTap.zip` 或带版本号的 ZIP 文件。
3. 解压下载的文件。
4. 在 Chrome 地址栏打开 `chrome://extensions/`。
5. 开启右上角的「开发者模式」。
6. 点击「加载已解压的扩展程序」，选择解压后的文件夹。

> Chrome 不支持直接从 ZIP 安装未上架的扩展，必须先解压。

### 使用

1. 点击 Chrome 工具栏中的 LinkTap 图标。
2. 选择一个或多个修饰键。
3. 按住所选按键并左键点击任意链接。
4. 页面右下角出现提示后，URL 已复制到剪贴板。

默认组合为 `Ctrl + Shift + 点击`。组合键采用精确匹配：如果设置为 `Ctrl`，`Ctrl + Shift + 点击` 不会触发。

### 权限说明

| 权限 | 用途 |
| --- | --- |
| 网页访问 | 检测用户点击的链接，仅读取被触发链接的 URL |
| `scripting` | 在安装、更新或打开设置时为现有标签页补充内容脚本 |
| `clipboardWrite` | 将链接 URL 写入剪贴板 |
| `storage` | 保存启用状态和快捷键偏好 |

LinkTap 不包含广告、统计、追踪器或外部网络请求，不保存或上传浏览记录。完整说明见 [PRIVACY.md](PRIVACY.md)。

### 使用限制

Chrome 不允许内容脚本运行在 `chrome://` 内部页面、Chrome 网上应用店及部分受保护页面，因此这些页面无法使用 LinkTap。

### 从源码构建

项目无需安装依赖或执行编译。使用 Python 3 生成可重复的发布包：

```bash
python3 scripts/package_release.py --update-readme
```

输出文件位于 `dist/`：

```text
LinkTap-<version>.zip
LinkTap-<version>.sha256
```

### 发布新版本

1. 更新 `manifest.json` 中的版本号和 `CHANGELOG.md`。
2. 运行 `python3 scripts/package_release.py --update-readme`，同步 README 中的 SHA-256。
3. 提交修改并创建对应标签，例如 `v2.0.2`。
4. 将标签推送到 GitHub。
5. GitHub Actions 会验证版本和 SHA-256，构建发布包并创建 GitHub Release。

[返回顶部](#top) · [Jump to English](#english)

---

<a id="english"></a>

## English

### Features

- Copy a complete link URL instantly by modifier-clicking it.
- Combine Ctrl / Control, Alt / Option, Shift, and Meta / Command freely.
- Match the configured modifiers exactly to prevent accidental activation.
- Prevent navigation, new-tab opening, and Option-click downloads when activated.
- Support macOS Control-click and all four modifiers used together.
- Save settings automatically and enable or pause LinkTap from the toolbar.
- Follow Chrome's interface language automatically.

### Supported languages

English, Simplified Chinese, Traditional Chinese, Japanese, and Korean. Other browser languages fall back to English.

### Installation

1. Open the [latest Release](https://github.com/haohailong/LinkTap/releases/latest).
2. Download `LinkTap.zip` or the versioned ZIP archive.
3. Extract the downloaded archive.
4. Open `chrome://extensions/` in Chrome.
5. Enable **Developer mode** in the top-right corner.
6. Select **Load unpacked** and choose the extracted folder.

> Chrome cannot install an unpublished extension directly from a ZIP archive. Extract it first.

### Usage

1. Select the LinkTap icon in the Chrome toolbar.
2. Choose one or more modifier keys.
3. Hold the selected keys and left-click any link.
4. When the confirmation appears, the URL is in your clipboard.

The default combination is `Ctrl + Shift + click`. Modifier matching is exact: if you configure `Ctrl`, `Ctrl + Shift + click` will not activate LinkTap.

### Permissions

| Permission | Purpose |
| --- | --- |
| Web page access | Detect the clicked link and read only its URL |
| `scripting` | Add the content script to existing tabs after install, update, or opening settings |
| `clipboardWrite` | Write the selected link URL to the clipboard |
| `storage` | Save the enabled state and modifier preferences |

LinkTap contains no ads, analytics, trackers, or external network requests. It does not store or upload browsing history. See [PRIVACY.md](PRIVACY.md) for details.

### Limitations

Chrome does not allow content scripts on `chrome://` pages, the Chrome Web Store, or some other protected pages, so LinkTap cannot run there.

### Build from source

No dependencies or compilation are required. Use Python 3 to create a reproducible release archive:

```bash
python3 scripts/package_release.py --update-readme
```

The generated files are placed in `dist/`:

```text
LinkTap-<version>.zip
LinkTap-<version>.sha256
```

### Publish a new release

1. Update the version in `manifest.json` and add the release notes to `CHANGELOG.md`.
2. Run `python3 scripts/package_release.py --update-readme` to synchronize the SHA-256 shown in this README.
3. Commit the changes and create a matching tag, such as `v2.0.2`.
4. Push the tag to GitHub.
5. GitHub Actions verifies the version and SHA-256, builds the release assets, and creates the GitHub Release.

[Back to top](#top) · [跳转到简体中文](#zh-cn)

---

## Contributing / 参与贡献

欢迎提交问题和改进建议。提交代码前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)，安全问题请按照 [SECURITY.md](SECURITY.md) 私下报告。

Issues and improvements are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting code. Please report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).

## License / 许可证

LinkTap 采用 [MIT License](LICENSE) 发布，允许使用、复制、修改、合并、发布和分发，但必须保留版权及许可证声明。

LinkTap is released under the [MIT License](LICENSE). You may use, copy, modify, merge, publish, and distribute it, provided that the copyright and license notice are retained.

版权所有 © 2026 [Hailong Hao](https://github.com/haohailong)（[@haohailong](https://github.com/haohailong)）。

Copyright © 2026 [Hailong Hao](https://github.com/haohailong) ([@haohailong](https://github.com/haohailong)).
