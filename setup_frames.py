#!/usr/bin/env python3
"""
Drop your zip of frames in the same folder as this script,
then run:  python3 setup_frames.py your_archive.zip

It will extract and rename every image to:
  assets/sequence/frame_001.jpg  ...  frame_NNN.jpg
sorted alphabetically/numerically so the order is preserved.
"""

import sys, os, zipfile, shutil
from pathlib import Path

DEST = Path(__file__).parent / "assets" / "sequence"
EXTS = {".jpg", ".jpeg", ".png", ".webp"}

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 setup_frames.py <path_to_zip>")
        sys.exit(1)

    zip_path = Path(sys.argv[1])
    if not zip_path.exists():
        print(f"File not found: {zip_path}")
        sys.exit(1)

    DEST.mkdir(parents=True, exist_ok=True)
    tmp = Path(__file__).parent / "_tmp_frames"
    tmp.mkdir(exist_ok=True)

    print(f"Extracting {zip_path.name} ...")
    with zipfile.ZipFile(zip_path) as z:
        z.extractall(tmp)

    # collect all image files recursively, sort them
    imgs = sorted([
        p for p in tmp.rglob("*")
        if p.suffix.lower() in EXTS and not p.name.startswith(".")
    ])

    if not imgs:
        print("No image files found inside the zip.")
        shutil.rmtree(tmp)
        sys.exit(1)

    print(f"Found {len(imgs)} frames. Copying to assets/sequence/ ...")
    for i, src in enumerate(imgs, start=1):
        # always save as .jpg for the site
        dst = DEST / f"frame_{str(i).zfill(3)}.jpg"
        shutil.copy2(src, dst)
        if i % 20 == 0 or i == len(imgs):
            print(f"  {i}/{len(imgs)}")

    shutil.rmtree(tmp)
    print(f"\nDone! {len(imgs)} frames written to assets/sequence/")
    print(f"\nOpen index.html and make sure TOTAL = {len(imgs)} in the <script>.")

if __name__ == "__main__":
    main()
