# Changelog

本项目的主要变更都会记录在此文件中，版本格式遵循 [Semantic Versioning](https://semver.org/)。

## [2.0.2] - 2026-09-15

### Added

- README 增加中英双语导航、Chrome Extension 标识和 Release SHA-256。
- 项目采用 MIT License，并在发布包中附带许可证。

### Changed

- 完善 macOS 元数据文件忽略规则。
- 打包流程会验证 README 中记录的 SHA-256 与发布包一致。

## [2.0.1] - 2026-09-15

### Security

- 移除网页可读取的调试状态标记，降低扩展指纹暴露。
- 为扩展页面添加明确的 Content Security Policy。
- 发布包排除 Git 历史、开发文件和图片元数据。

### Added

- 可重复生成 Release ZIP 和 SHA-256 的打包脚本。
- GitHub Release 自动发布工作流。
- 隐私、安全、贡献与发布文档。

## [2.0.0] - 2026-09-02

### Added

- 品牌名称 LinkTap 和全新应用图标。
- 重新设计的扩展设置弹窗。
- 英语、简体中文、繁体中文、日语和韩语本地化。

## [1.2.0] - 2026-09-02

### Fixed

- 修复 macOS Control + 点击以及四修饰键组合无法触发的问题。
- 修复快速连续修改快捷键时可能出现的设置写入顺序问题。

## [1.1.0] - 2026-09-02

### Fixed

- 安装、更新和启动时主动为已打开标签页补充内容脚本。
- 支持 Shadow DOM 中的链接。

## [1.0.0] - 2026-09-02

- 首个可用版本。
