# Contributing to LinkTap

感谢你帮助改进 LinkTap。

## 开发环境

- Chrome 或兼容 Chromium 浏览器。
- Python 3，仅用于生成 Release ZIP。
- 项目没有第三方运行时依赖，也不需要构建前端代码。

## 本地测试

1. 打开 `chrome://extensions/` 并启用开发者模式。
2. 点击「加载已解压的扩展程序」，选择项目根目录。
3. 修改代码后在扩展卡片上点击「重新加载」。
4. 至少测试一个单键组合、一个多键组合、启用/暂停状态和复制提示。
5. 在 macOS 上额外测试包含 Control 的组合。

## 生成发布包

```bash
python3 scripts/package_release.py
```

打包脚本只包含运行所需文件，并自动生成 SHA-256 校验文件。

## Pull Request 检查清单

- 变更保持 LinkTap 的单一用途。
- 没有加入远程代码、统计或不必要的权限。
- 新增文案已同步更新所有 `_locales` 语言包。
- `manifest.json`、JavaScript 和语言包均可正常解析。
- 用户可见变更已记录在 `CHANGELOG.md`。

安全漏洞请不要提交公开 Issue，参见 [SECURITY.md](SECURITY.md)。
