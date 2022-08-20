import PyPDF2

pdfFileObj = open('raw.pdf', 'rb')
file = open('rawText.txt', 'w')
pdfReader = PyPDF2.PdfFileReader(pdfFileObj)

len = pdfReader.numPages

for i in range(len):
    content = pdfReader.getPage(i).extract_text()
    file.write(content)

file.close()
pdfFileObj.close()