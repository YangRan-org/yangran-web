import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, unquote
from pathlib import Path


def download_ucsf_slides():
    # Target webpage
    base_url = "https://highriskem.ucsf.edu/program-agenda"

    # Set up the target directory on macOS: ~/Downloads/highriskem/2026
    # Path.home() automatically grabs your Mac user directory (e.g., /Users/YourName/)
    download_dir = Path.home() / "Downloads" / "highriskem" / "2026"

    # Create the directories if they don't exist
    download_dir.mkdir(parents=True, exist_ok=True)
    print(f"Saving files to: {download_dir}\n")

    # Fetch the webpage
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'}
    response = requests.get(base_url, headers=headers)
    response.raise_for_status()

    # Parse the HTML content
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find all hyperlink tags
    links = soup.find_all('a', href=True)

    # Common presentation file extensions
    valid_extensions = ('.pdf', '.ppt', '.pptx')
    downloaded_count = 0

    for link in links:
        href = link['href']

        # Check if the hyperlink points to a slide/document file
        if href.lower().endswith(valid_extensions) or "/sites/default/files/" in href:
            # Convert relative URLs (like /files/slide.pdf) to full URLs
            full_url = urljoin(base_url, href)

            # Extract a clean file name from the URL
            file_name = unquote(full_url.split("/")[-1])

            # Skip if it's not a file (failsafe)
            if not file_name or "." not in file_name:
                continue

            file_path = download_dir / file_name

            # Download the file
            print(f"Downloading: {file_name}...")
            try:
                file_response = requests.get(full_url, headers=headers)
                file_response.raise_for_status()

                with open(file_path, 'wb') as f:
                    f.write(file_response.content)
                downloaded_count += 1

            except Exception as e:
                print(f"Failed to download {file_name}. Error: {e}")

    if downloaded_count == 0:
        print("\nNo slides or PDFs found with direct links.")
        print("Note: If the site uses Box/Google Drive redirects or a login wall, a standard scraper won't be able to bypass it automatically.")
    else:
        print(
            f"\nSuccess! Downloaded {downloaded_count} files to {download_dir}.")


if __name__ == "__main__":
    download_ucsf_slides()
