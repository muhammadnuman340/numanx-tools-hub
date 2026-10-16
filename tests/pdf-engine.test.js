// FILE: tests/pdf-engine.test.js
import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { mergeClientPDFs, extractPDFPageRange } from '../src/utils/pdfEngine.js';

describe('Zero-Server PDF Engine (pdf-lib)', () => {
  it('merges two PDF documents into a single combined PDF', async () => {
    // Create 2 minimal test PDFs
    const pdf1 = await PDFDocument.create();
    pdf1.addPage([200, 200]);
    const bytes1 = await pdf1.save();
    const blob1 = new Blob([bytes1], { type: 'application/pdf' });

    const pdf2 = await PDFDocument.create();
    pdf2.addPage([200, 200]);
    pdf2.addPage([200, 200]);
    const bytes2 = await pdf2.save();
    const blob2 = new Blob([bytes2], { type: 'application/pdf' });

    const mergedBlob = await mergeClientPDFs([blob1, blob2]);
    expect(mergedBlob.type).toBe('application/pdf');

    const mergedBuffer = await mergedBlob.arrayBuffer();
    const loadedMerged = await PDFDocument.load(mergedBuffer);
    expect(loadedMerged.getPageCount()).toBe(3); // 1 + 2 = 3 pages
  });

  it('extracts a contiguous page range from a multi-page PDF', async () => {
    const doc = await PDFDocument.create();
    doc.addPage([200, 200]); // page 1
    doc.addPage([200, 200]); // page 2
    doc.addPage([200, 200]); // page 3
    doc.addPage([200, 200]); // page 4
    const bytes = await doc.save();
    const blob = new Blob([bytes], { type: 'application/pdf' });

    // Extract pages 2 to 3
    const slicedBlob = await extractPDFPageRange(blob, 2, 3);
    expect(slicedBlob.type).toBe('application/pdf');

    const slicedBuffer = await slicedBlob.arrayBuffer();
    const loadedSliced = await PDFDocument.load(slicedBuffer);
    expect(loadedSliced.getPageCount()).toBe(2);
  });

  it('throws error when no PDF files provided to merge', async () => {
    await expect(mergeClientPDFs([])).rejects.toThrow('No PDF files provided');
  });
});
