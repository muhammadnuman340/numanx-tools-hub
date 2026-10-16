// FILE: src/utils/pdfEngine.js
import { PDFDocument } from 'pdf-lib';

/**
 * Merges multiple PDF file objects into a single cohesive PDF document entirely client-side.
 * @param {Array<File|Blob>} pdfFiles - Array of PDF Blob or File instances
 * @returns {Promise<Blob>} Merged PDF Blob with type 'application/pdf'
 */
export async function mergeClientPDFs(pdfFiles = []) {
  if (!pdfFiles || pdfFiles.length === 0) {
    throw new Error('No PDF files provided for merging');
  }

  const mergedPdf = await PDFDocument.create();

  for (const file of pdfFiles) {
    const buffer = await file.arrayBuffer();
    const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const pages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
    pages.forEach((p) => mergedPdf.addPage(p));
  }

  const bytes = await mergedPdf.save();
  return new Blob([bytes], { type: 'application/pdf' });
}

/**
 * Extracts a 1-indexed contiguous page range from a source PDF document.
 * @param {File|Blob} pdfFile - Source PDF Blob or File
 * @param {number} startPage - 1-indexed starting page
 * @param {number} endPage - 1-indexed ending page
 * @returns {Promise<Blob>} Sliced PDF Blob with type 'application/pdf'
 */
export async function extractPDFPageRange(pdfFile, startPage = 1, endPage = 1) {
  if (!pdfFile) {
    throw new Error('No source PDF provided for page extraction');
  }

  const buffer = await pdfFile.arrayBuffer();
  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();

  if (totalPages === 0) {
    throw new Error('The provided PDF contains 0 pages');
  }

  const s = Math.max(1, Math.min(startPage, totalPages)) - 1;
  const e = Math.max(s, Math.min(endPage, totalPages) - 1);

  const extractedPdf = await PDFDocument.create();
  const indices = Array.from({ length: e - s + 1 }, (_, i) => s + i);
  const copied = await extractedPdf.copyPages(srcDoc, indices);
  copied.forEach((p) => extractedPdf.addPage(p));

  const bytes = await extractedPdf.save();
  return new Blob([bytes], { type: 'application/pdf' });
}
