from pathlib import Path
import fitz

source = Path("attached_assets/unnamed_1_1787137017455.pdf")
output_dir = Path(".agents/outputs/logo-pdf")
output_dir.mkdir(parents=True, exist_ok=True)

document = fitz.open(source)
print(f"pages={document.page_count}")
print(f"metadata={document.metadata}")

for page_index, page in enumerate(document):
    print(f"page={page_index + 1} rect={page.rect}")
    print(f"images={len(page.get_images(full=True))}")
    print(f"text={page.get_text()[:500]!r}")
    pixmap = page.get_pixmap(matrix=fitz.Matrix(3, 3), alpha=True)
    output_path = output_dir / f"page-{page_index + 1}.png"
    pixmap.save(output_path)
    print(f"rendered={output_path}")

    for image_index, image in enumerate(page.get_images(full=True)):
        xref = image[0]
        extracted = document.extract_image(xref)
        extension = extracted["ext"]
        image_path = output_dir / f"page-{page_index + 1}-image-{image_index + 1}.{extension}"
        image_path.write_bytes(extracted["image"])
        print(f"extracted={image_path} size={len(extracted['image'])}")