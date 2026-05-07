import fitz

def parse_pdf(file_bytes):

    text = ""

    pdf = fitz.open(
        stream=file_bytes,
        filetype="pdf"
    )

    for page in pdf:
        text += page.get_text()

    return text