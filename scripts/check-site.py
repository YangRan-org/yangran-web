#!/usr/bin/env python3
"""Dependency-free checks for the static yangran.org site."""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urldefrag, urlparse


ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = sorted(ROOT.glob("*.html"))
MCP_TEMP_URL = "https://mentoring-for-careers-in-physics.github.io/mcp-site/"
MCP_FUTURE_URL = "https://mcp.physics.wm.edu"


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.links = []
        self.meta_names = set()
        self.meta_props = set()
        self.meta_content = {}
        self.link_rels = set()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.add(attrs["id"])
        for attr in ("href", "src"):
            if attr in attrs:
                self.links.append((tag, attr, attrs[attr]))
        if tag == "meta":
            if attrs.get("name"):
                self.meta_names.add(attrs["name"])
                if attrs.get("content"):
                    self.meta_content[attrs["name"]] = attrs["content"]
            if attrs.get("property"):
                self.meta_props.add(attrs["property"])
                if attrs.get("content"):
                    self.meta_content[attrs["property"]] = attrs["content"]
        if tag == "link" and attrs.get("rel"):
            for rel in attrs["rel"].split():
                self.link_rels.add(rel)


def parse_page(path):
    parser = PageParser()
    parser.feed(path.read_text(encoding="utf-8"))
    return parser


def is_external(url):
    parsed = urlparse(url)
    return parsed.scheme in {"http", "https", "mailto", "tel"}


def local_target(page, url):
    path_part, frag = urldefrag(url)
    if not path_part:
        return page, frag
    path_value = urlparse(path_part).path
    target = (page.parent / path_value.lstrip("/")).resolve()
    try:
        target.relative_to(ROOT)
    except ValueError:
        return None, frag
    return target, frag


def main():
    failures = []
    pages = {path: parse_page(path) for path in HTML_FILES}

    required_meta_names = {
        "description",
        "theme-color",
        "twitter:card",
        "twitter:title",
        "twitter:description",
        "twitter:image",
    }
    required_meta_props = {
        "og:title",
        "og:description",
        "og:url",
        "og:image",
    }

    for page, parser in pages.items():
        missing_names = sorted(required_meta_names - parser.meta_names)
        missing_props = sorted(required_meta_props - parser.meta_props)
        if "canonical" not in parser.link_rels:
            failures.append(f"{page.name}: missing canonical link")
        if "icon" not in parser.link_rels:
            failures.append(f"{page.name}: missing favicon link")
        if missing_names:
            failures.append(f"{page.name}: missing meta name {', '.join(missing_names)}")
        if missing_props:
            failures.append(f"{page.name}: missing meta property {', '.join(missing_props)}")

        for key in ("og:image", "twitter:image"):
            image_url = parser.meta_content.get(key, "")
            parsed_image = urlparse(image_url)
            if parsed_image.netloc == "yangran.org":
                image_path = (ROOT / parsed_image.path.lstrip("/")).resolve()
                if not image_path.exists():
                    failures.append(f"{page.name}: {key} target missing: {image_url}")

        for tag, attr, url in parser.links:
            if is_external(url) or url.startswith(("data:", "javascript:")):
                continue
            target, frag = local_target(page, url)
            if target is None:
                continue
            if not target.exists():
                failures.append(f"{page.name}: {attr} target missing: {url}")
                continue
            if frag and target.suffix == ".html":
                target_parser = pages.get(target) or parse_page(target)
                if frag not in target_parser.ids:
                    failures.append(f"{page.name}: anchor missing: {url}")

    for path in ROOT.glob("*"):
        if path.name == "README.md":
            continue
        if path.is_file() and path.suffix in {".html", ".css", ".js", ".jsx"}:
            text = path.read_text(encoding="utf-8")
            if MCP_FUTURE_URL in text:
                failures.append(f"{path.name}: still points to future MCP DNS host")

    visible_html = "\n".join(path.read_text(encoding="utf-8") for path in HTML_FILES if path.name != "9stars.html")
    if MCP_TEMP_URL not in visible_html:
        failures.append("Visible pages do not reference the temporary MCP URL")

    if failures:
        print("Site checks failed:")
        for failure in failures:
            print(f" - {failure}")
        raise SystemExit(1)

    print(f"Site checks passed for {len(HTML_FILES)} HTML files.")


if __name__ == "__main__":
    main()
