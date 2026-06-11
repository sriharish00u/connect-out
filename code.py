import os
import fnmatch
from pathlib import Path

ROOT = Path(__file__).parent.resolve()
OUT = ROOT / "code.md"
GITIGNORE = ROOT / ".gitignore"

# Base patterns — things we always skip
SKIP_PATTERNS = [
    ".git",
    ".env",
    ".env.*",
    "node_modules",
    "__pycache__",
    "*.pyc",
    ".DS_Store",
    "dist",
    "dist-ssr",
    ".output",
    ".vinxi",
    ".nitro",
    ".wrangler",
    ".dev.vars",
    "bun.lock",
    "bun.lockb",
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    ".tanstack",
    "design",
    "code.md",
    "*.png",
]

# Load ignore patterns from .gitignore
def load_gitignore(path):
    patterns = []
    if path.exists():
        with open(path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    patterns.append(line)
    return patterns


def should_ignore(name, rel_path, gitignore_patterns):
    parts = rel_path.split(os.sep)
    for p in parts:
        if p in SKIP_PATTERNS:
            return True
        for pat in SKIP_PATTERNS:
            if fnmatch.fnmatch(p, pat):
                return True
    for pat in gitignore_patterns:
        # match against any path component
        for sub in [rel_path, *parts]:
            if fnmatch.fnmatch(sub, pat):
                return True
    return False


def collect_files(root, gitignore_patterns):
    files = []
    for dirpath, dirnames, filenames in os.walk(root):
        # Build relative path from ROOT
        rel_dir = os.path.relpath(dirpath, root)
        if rel_dir == ".":
            rel_dir = ""

        # Prune ignored directories in-place (prevents os.walk descending)
        dirnames[:] = [
            d
            for d in dirnames
            if not should_ignore(
                d, os.path.join(rel_dir, d) if rel_dir else d, gitignore_patterns
            )
        ]

        for f in filenames:
            rel_path = os.path.join(rel_dir, f) if rel_dir else f
            if should_ignore(f, rel_path, gitignore_patterns):
                continue
            files.append(os.path.join(dirpath, f))

    return sorted(files)


def main():
    gitignore_patterns = load_gitignore(GITIGNORE)
    files = collect_files(ROOT, gitignore_patterns)

    lines = []
    for fp in files:
        rel = os.path.relpath(fp, ROOT)
        ext = Path(fp).suffix.lstrip(".") or "text"
        lines.append(f"## {rel}\n")
        lines.append(f"```{ext}\n")
        try:
            with open(fp, "r", encoding="utf-8", errors="replace") as fh:
                content = fh.read()
            lines.append(content)
        except Exception as e:
            lines.append(f"<error reading file: {e}>\n")
        if not content.endswith("\n"):
            lines.append("\n")
        lines.append("```\n\n")

    OUT.write_text("".join(lines), encoding="utf-8")
    print(f"Written {len(files)} files to {OUT}")


if __name__ == "__main__":
    main()
