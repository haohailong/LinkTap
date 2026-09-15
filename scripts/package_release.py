#!/usr/bin/env python3
"""Build a deterministic, share-ready LinkTap release archive."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import struct
import sys
import zlib
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo


PROJECT_ROOT = Path(__file__).resolve().parent.parent
README_PATH = PROJECT_ROOT / "README.md"
FIXED_TIMESTAMP = (2026, 1, 1, 0, 0, 0)
PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"
PNG_METADATA_CHUNKS = {b"eXIf", b"iTXt", b"tEXt", b"tIME", b"zTXt"}

RELEASE_FILES = (
    "CHANGELOG.md",
    "LICENSE",
    "PRIVACY.md",
    "assets/icons/icon16.png",
    "assets/icons/icon32.png",
    "assets/icons/icon48.png",
    "assets/icons/icon128.png",
    "content.js",
    "manifest.json",
    "popup.css",
    "popup.html",
    "popup.js",
    "service-worker.js",
)

README_CHECKSUM_PATTERN = re.compile(
    r"(<!-- release-sha256:start -->\n).*?(\n<!-- release-sha256:end -->)",
    re.DOTALL,
)


def clean_png(data: bytes) -> bytes:
    """Remove common metadata chunks while preserving rendered PNG content."""
    if not data.startswith(PNG_SIGNATURE):
        raise ValueError("invalid PNG signature")

    output = bytearray(PNG_SIGNATURE)
    offset = len(PNG_SIGNATURE)
    saw_end = False

    while offset < len(data):
        if offset + 12 > len(data):
            raise ValueError("truncated PNG chunk")
        length = struct.unpack(">I", data[offset : offset + 4])[0]
        chunk_end = offset + 12 + length
        if chunk_end > len(data):
            raise ValueError("invalid PNG chunk length")

        chunk_type = data[offset + 4 : offset + 8]
        chunk_data = data[offset + 8 : offset + 8 + length]
        expected_crc = struct.unpack(">I", data[offset + 8 + length : chunk_end])[0]
        actual_crc = zlib.crc32(chunk_type + chunk_data) & 0xFFFFFFFF
        if expected_crc != actual_crc:
            raise ValueError(f"invalid PNG CRC for {chunk_type!r}")

        if chunk_type not in PNG_METADATA_CHUNKS:
            output.extend(data[offset:chunk_end])

        offset = chunk_end
        if chunk_type == b"IEND":
            saw_end = True
            break

    if not saw_end or offset != len(data):
        raise ValueError("invalid PNG ending")
    return bytes(output)


def release_paths() -> list[Path]:
    paths = [PROJECT_ROOT / relative for relative in RELEASE_FILES]
    paths.extend(sorted((PROJECT_ROOT / "_locales").glob("*/messages.json")))
    missing = [path for path in paths if not path.is_file()]
    if missing:
        missing_list = ", ".join(str(path.relative_to(PROJECT_ROOT)) for path in missing)
        raise FileNotFoundError(f"missing release files: {missing_list}")
    return sorted(paths, key=lambda path: path.relative_to(PROJECT_ROOT).as_posix())


def manifest_version() -> str:
    manifest = json.loads((PROJECT_ROOT / "manifest.json").read_text(encoding="utf-8"))
    version = manifest.get("version")
    if not isinstance(version, str) or not version:
        raise ValueError("manifest.json has no valid version")
    return version


def archive_bytes(path: Path) -> bytes:
    data = path.read_bytes()
    if path.suffix.lower() == ".png":
        return clean_png(data)
    return data


def build(output_dir: Path) -> tuple[Path, Path, str]:
    version = manifest_version()
    output_dir.mkdir(parents=True, exist_ok=True)
    archive = output_dir / f"LinkTap-{version}.zip"
    checksum_file = output_dir / f"LinkTap-{version}.sha256"

    with ZipFile(archive, "w", compression=ZIP_DEFLATED, compresslevel=9) as bundle:
        for source in release_paths():
            relative = source.relative_to(PROJECT_ROOT).as_posix()
            info = ZipInfo(relative, date_time=FIXED_TIMESTAMP)
            info.compress_type = ZIP_DEFLATED
            info.create_system = 3
            info.external_attr = 0o100644 << 16
            bundle.writestr(info, archive_bytes(source), compress_type=ZIP_DEFLATED, compresslevel=9)

    digest = hashlib.sha256(archive.read_bytes()).hexdigest()
    checksum_file.write_text(f"{digest}  {archive.name}\n", encoding="utf-8")
    return archive, checksum_file, digest


def update_readme_checksum(version: str, digest: str) -> None:
    readme = README_PATH.read_text(encoding="utf-8")
    block = (
        '<p align="center">\n'
        f"  <strong>v{version} · SHA-256 (LinkTap.zip)</strong><br>\n"
        f"  <code>{digest}</code><br>\n"
        '  <a href="https://github.com/haohailong/LinkTap/releases/latest/download/LinkTap.zip.sha256">'
        "校验文件 / Checksum file</a>\n"
        "</p>"
    )
    updated, replacements = README_CHECKSUM_PATTERN.subn(r"\1" + block + r"\2", readme)
    if replacements != 1:
        raise ValueError("README checksum markers are missing or duplicated")
    README_PATH.write_text(updated, encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=PROJECT_ROOT / "dist",
        help="directory for the ZIP and SHA-256 file (default: dist)",
    )
    parser.add_argument(
        "--update-readme",
        action="store_true",
        help="update the release SHA-256 block in README.md",
    )
    args = parser.parse_args()

    try:
        archive, checksum_file, digest = build(args.output_dir.resolve())
        if args.update_readme:
            update_readme_checksum(manifest_version(), digest)
    except (FileNotFoundError, ValueError, json.JSONDecodeError) as error:
        print(f"Release build failed: {error}", file=sys.stderr)
        return 1

    print(f"Created {archive}")
    print(f"Created {checksum_file}")
    print(f"SHA-256 {digest}")
    if args.update_readme:
        print(f"Updated {README_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
