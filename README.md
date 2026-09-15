<p align="center">
  <img src="assets/icons/icon128.png" width="112" height="112" alt="LinkTap Logo">
</p>

<h1 align="center">LinkTap</h1>

<p align="center">
  按住自定义修饰键，点击即可复制链接。<br>
  <sub>Modifier-click any link to copy its URL without opening it.</sub>
</p>

<p align="center">
  <img alt="Version 2.0.1" src="https://img.shields.io/badge/version-2.0.1-1744e8?style=flat-square">
  <img alt="Manifest V3" src="https://img.shields.io/badge/Chrome-Manifest_V3-34a853?style=flat-square&logo=googlechrome&logoColor=white">
  <img alt="5 languages" src="https://img.shields.io/badge/languages-5-7c3aed?style=flat-square">
</p>

<p align="center">
  <a href="../../releases/latest"><strong>下载最新版本</strong></a>
  ·
  <a href="CHANGELOG.md">更新记录</a>
  ·
  <a href="PRIVACY.md">隐私说明</a>
  ·
  <a href="SECURITY.md">安全政策</a>
</p>

---

## 功能

- 按住一个或多个修饰键并点击链接，立即复制完整 URL。
- 自由组合 Ctrl / Control、Alt / Option、Shift、Meta / Command。
- 精确匹配快捷键，避免误触。
- 阻止链接跳转、新标签页打开及 Option + 点击下载等默认行为。
- 兼容 macOS 的 Control + 点击及四修饰键组合。
- 设置自动保存，并可通过浏览器工具栏随时启用或暂停。
- 自动跟随 Chrome 界面语言。

## 支持语言

- English
- 简体中文
- 繁體中文
- 日本語
- 한국어

不在列表中的语言会自动使用英语。

## 安装

### 从 Release 安装

1. 打开 [Releases](../../releases/latest)。
2. 下载 `LinkTap.zip` 或带版本号的 ZIP 文件。
3. 解压下载的文件。
4. 在 Chrome 地址栏打开 `chrome://extensions/`。
5. 开启右上角的「开发者模式」。
6. 点击「加载已解压的扩展程序」，选择解压后的文件夹。

> Chrome 不支持直接从 ZIP 安装未上架的扩展，必须先解压。

## 使用

1. 点击 Chrome 工具栏中的 LinkTap 图标。
2. 选择一个或多个修饰键。
3. 按住所选按键并左键点击任意链接。
4. 页面右下角出现提示后，URL 已复制到剪贴板。

默认组合为 `Ctrl + Shift + 点击`。组合键采用精确匹配：如果设置为 `Ctrl`，`Ctrl + Shift + 点击` 不会触发。

## 权限说明

| 权限 | 用途 |
| --- | --- |
| 网页访问 | 检测用户点击的链接，仅读取被触发链接的 URL |
| `scripting` | 在安装、更新或打开设置时为现有标签页补充内容脚本 |
| `clipboardWrite` | 将链接 URL 写入剪贴板 |
| `storage` | 保存启用状态和快捷键偏好 |

LinkTap 不包含广告、统计、追踪器或外部网络请求，不保存或上传浏览记录。完整说明见 [PRIVACY.md](PRIVACY.md)。

## 限制

Chrome 不允许内容脚本运行在 `chrome://` 内部页面、Chrome 网上应用店及部分受保护页面，因此这些页面无法使用 LinkTap。

## 从源码构建

项目无需安装依赖或执行编译。使用 Python 3 生成可重复的发布包：

```bash
python3 scripts/package_release.py
```

输出文件位于 `dist/`：

```text
LinkTap-<version>.zip
LinkTap-<version>.sha256
```

## 发布新版本

1. 更新 `manifest.json` 中的版本号和 `CHANGELOG.md`。
2. 提交修改并创建对应标签，例如 `v2.0.1`。
3. 将标签推送到 GitHub。
4. GitHub Actions 会验证版本、构建 ZIP、生成 SHA-256，并创建 GitHub Release。

## 参与贡献

欢迎提交问题和改进建议。提交代码前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)，安全问题请按照 [SECURITY.md](SECURITY.md) 私下报告。

## 许可证

本项目尚未声明开源许可证。公开发布前，请由项目所有者选择适合的许可证；未明确授权的情况下，默认版权仍由项目所有者保留。
