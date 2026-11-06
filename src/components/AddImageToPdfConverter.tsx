import { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import type { RouteSEOConfig } from '../config/seoRoutes';
import './AddImageToPdf.css';

interface AddImageToPdfConverterProps {
  config: RouteSEOConfig;
}

interface PdfFileInfo {
  file: File;
  name: string;
  sizeFormatted: string;
  pageCount: number;
  arrayBuffer: ArrayBuffer;
}

interface ImageFileInfo {
  file: File;
  name: string;
  sizeFormatted: string;
  url: string;
  width: number;
  height: number;
}

type PlacementPosition =
  | 'bottom-right'
  | 'center'
  | 'top-center'
  | 'bottom-center'
  | 'top-right'
  | 'top-left'
  | 'bottom-left'
  | 'fit';

type PageTarget = 'first' | 'last' | 'specific' | 'all' | 'new-page';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function AddImageToPdfConverter({ config }: AddImageToPdfConverterProps) {
  const [pdfInfo, setPdfInfo] = useState<PdfFileInfo | null>(null);
  const [imageInfo, setImageInfo] = useState<ImageFileInfo | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Placement Options
  const [pageTarget, setPageTarget] = useState<PageTarget>('first');
  const [specificPageNumber, setSpecificPageNumber] = useState<number>(1);
  const [position, setPosition] = useState<PlacementPosition>('bottom-right');
  const [scalePercent, setScalePercent] = useState<number>(35);
  const [opacityPercent, setOpacityPercent] = useState<number>(100);

  // Drag states
  const [isPdfDragOver, setIsPdfDragOver] = useState(false);
  const [isImgDragOver, setIsImgDragOver] = useState(false);

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);

  // Handle PDF Upload
  const handlePdfFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setErrorMessage('Please select a valid PDF document (.pdf).');
      return;
    }

    setErrorMessage(null);
    setIsLoadingPdf(true);

    try {
      const buffer = await file.arrayBuffer();
      // Load PDF with pdf-lib to verify and count pages
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdfDoc.getPageCount();

      setPdfInfo({
        file,
        name: file.name,
        sizeFormatted: formatFileSize(file.size),
        pageCount: count,
        arrayBuffer: buffer,
      });
      setSpecificPageNumber(1);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setErrorMessage('Could not parse this PDF. It may be encrypted or corrupted.');
    } finally {
      setIsLoadingPdf(false);
    }
  };

  // Handle Image Upload
  const handleImageFile = async (file: File) => {
    setErrorMessage(null);

    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext)) || file.type.startsWith('image/');

    if (!isValid) {
      setErrorMessage('Please select a valid image file (JPG, PNG, or WEBP).');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const img = new Image();
    img.src = previewUrl;

    img.onload = () => {
      setImageInfo({
        file,
        name: file.name,
        sizeFormatted: formatFileSize(file.size),
        url: previewUrl,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
      });
    };

    img.onerror = () => {
      setErrorMessage('Failed to read image dimensions. Please try another image file.');
      URL.revokeObjectURL(previewUrl);
    };
  };

  // Reset entire workflow
  const handleReset = () => {
    if (imageInfo) {
      URL.revokeObjectURL(imageInfo.url);
    }
    setPdfInfo(null);
    setImageInfo(null);
    setErrorMessage(null);
    setPageTarget('first');
    setPosition('bottom-right');
    setScalePercent(35);
    setOpacityPercent(100);
  };

  // Process & Merge Client-side using pdf-lib
  const handleMergeAndDownload = async () => {
    if (!pdfInfo || !imageInfo) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // 1. Load PDF Document from in-memory arrayBuffer
      const pdfDoc = await PDFDocument.load(pdfInfo.arrayBuffer);

      // 2. Embed image (with Canvas normalization fallback)
      let embeddedImage;
      const imgBuffer = await imageInfo.file.arrayBuffer();
      const lowerName = imageInfo.file.name.toLowerCase();

      if (imageInfo.file.type === 'image/jpeg' || lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) {
        try {
          embeddedImage = await pdfDoc.embedJpg(imgBuffer);
        } catch (e) {
          console.warn('Native embedJpg failed, falling back to canvas:', e);
        }
      } else if (imageInfo.file.type === 'image/png' || lowerName.endsWith('.png')) {
        try {
          embeddedImage = await pdfDoc.embedPng(imgBuffer);
        } catch (e) {
          console.warn('Native embedPng failed, falling back to canvas:', e);
        }
      }

      // Fallback: draw on canvas to generate clean PNG bytes (supports all formats including WEBP)
      if (!embeddedImage) {
        const canvas = document.createElement('canvas');
        const img = new Image();
        img.src = imageInfo.url;
        await new Promise((res) => {
          img.onload = res;
        });
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);

        const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), 'image/png'));
        const fallbackBytes = await blob.arrayBuffer();
        embeddedImage = await pdfDoc.embedPng(fallbackBytes);
      }

      const imgWidth = embeddedImage.width;
      const imgHeight = embeddedImage.height;
      const opacity = opacityPercent / 100;
      const scaleMultiplier = scalePercent / 100;

      // 3. Draw image onto target pages or append as new page
      if (pageTarget === 'new-page') {
        const newPage = pdfDoc.addPage([imgWidth, imgHeight]);
        newPage.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: imgWidth,
          height: imgHeight,
          opacity,
        });
      } else {
        const pages = pdfDoc.getPages();
        let targetPages = [];

        if (pageTarget === 'all') {
          targetPages = pages;
        } else if (pageTarget === 'first') {
          targetPages = [pages[0]];
        } else if (pageTarget === 'last') {
          targetPages = [pages[pages.length - 1]];
        } else {
          const idx = Math.min(Math.max(0, specificPageNumber - 1), pages.length - 1);
          targetPages = [pages[idx]];
        }

        for (const page of targetPages) {
          const { width: pageWidth, height: pageHeight } = page.getSize();

          let drawWidth: number;
          let drawHeight: number;

          if (position === 'fit') {
            const fitScale = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
            drawWidth = imgWidth * fitScale;
            drawHeight = imgHeight * fitScale;
          } else {
            // Apply scale multiplier relative to page size
            const baseScale = Math.min(pageWidth / imgWidth, pageHeight / imgHeight) * 0.8;
            drawWidth = imgWidth * baseScale * scaleMultiplier;
            drawHeight = imgHeight * baseScale * scaleMultiplier;
          }

          let x = 0;
          let y = 0;
          const margin = 24; // 24pt margin

          switch (position) {
            case 'center':
            case 'fit':
              x = (pageWidth - drawWidth) / 2;
              y = (pageHeight - drawHeight) / 2;
              break;
            case 'bottom-right':
              x = pageWidth - drawWidth - margin;
              y = margin;
              break;
            case 'bottom-left':
              x = margin;
              y = margin;
              break;
            case 'bottom-center':
              x = (pageWidth - drawWidth) / 2;
              y = margin;
              break;
            case 'top-center':
              x = (pageWidth - drawWidth) / 2;
              y = pageHeight - drawHeight - margin;
              break;
            case 'top-right':
              x = pageWidth - drawWidth - margin;
              y = pageHeight - drawHeight - margin;
              break;
            case 'top-left':
              x = margin;
              y = pageHeight - drawHeight - margin;
              break;
          }

          page.drawImage(embeddedImage, {
            x,
            y,
            width: drawWidth,
            height: drawHeight,
            opacity,
          });
        }
      }

      // 4. Export modified PDF entirely in browser
      const modifiedPdfBytes = await pdfDoc.save();
      const outputBlob = new Blob([modifiedPdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(outputBlob);

      const baseName = pdfInfo.name.replace(/\.pdf$/i, '');
      const downloadName = `${baseName}-with-image.pdf`;

      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = downloadName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Error modifying PDF:', err);
      setErrorMessage('Failed to merge image into PDF. Please verify your files and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="add-image-wrapper">
      {/* Hero Header */}
      <header className="page-hero-header">
        <div className="hero-badge-row">
          <div className="route-badge-pill">
            <span className="route-badge-icon">{config.icon}</span>
            <span>{config.badge}</span>
          </div>
          <div className="free-badge-pill">
            <span className="free-badge-sparkle">✨</span>
            <span>100% Free • Unlimited</span>
          </div>
        </div>
        <h1>
          {config.headingPrefix}
          <span className="highlight">{config.headingHighlight}</span>
        </h1>
        <p className="hero-subheading">{config.subheading}</p>
      </header>

      {/* Error Message Toast */}
      {errorMessage && (
        <div className="format-notice-banner error-state" role="alert">
          <span>⚠️ {errorMessage}</span>
          <button type="button" className="notice-close" onClick={() => setErrorMessage(null)}>
            ×
          </button>
        </div>
      )}

      {/* STEP 1: PDF UPLOAD */}
      {!pdfInfo && (
        <div className="step-workflow-card">
          <div className="step-badge-indicator">Step 1 of 2</div>
          <h2 className="step-header-title">Upload Existing PDF Document</h2>
          <p className="step-header-desc">Choose the PDF document where you want to insert or overlay an image.</p>

          <div
            className={`drop-zone pdf-drop-zone ${isPdfDragOver ? 'drag-over' : ''} ${isLoadingPdf ? 'loading' : ''}`}
            onClick={() => pdfInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsPdfDragOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsPdfDragOver(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsPdfDragOver(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handlePdfFile(e.dataTransfer.files[0]);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <div className="icon">📄</div>
            <p className="dropzone-main-text">
              {isLoadingPdf ? 'Reading PDF...' : 'Click or Drag PDF file here'}
            </p>
            <span className="dropzone-type-hint">Accepts .pdf files (Multi-page supported)</span>
            <input
              type="file"
              accept=".pdf,application/pdf"
              ref={pdfInputRef}
              onChange={(e) => e.target.files?.[0] && handlePdfFile(e.target.files[0])}
              hidden
            />
          </div>
        </div>
      )}

      {/* PDF IS LOADED: SHOW ACTIVE PDF BANNER & STEP 2 */}
      {pdfInfo && (
        <div className="active-pdf-container">
          {/* PDF Meta Strip */}
          <div className="pdf-summary-strip">
            <div className="pdf-summary-left">
              <span className="pdf-icon-badge">📄</span>
              <div className="pdf-details">
                <span className="pdf-name" title={pdfInfo.name}>{pdfInfo.name}</span>
                <span className="pdf-meta-pill">
                  {pdfInfo.pageCount} {pdfInfo.pageCount === 1 ? 'Page' : 'Pages'} • {pdfInfo.sizeFormatted}
                </span>
              </div>
            </div>
            <button type="button" className="change-file-btn" onClick={handleReset} title="Upload a different PDF">
              Change PDF
            </button>
          </div>

          {/* STEP 2: IMAGE UPLOAD & PLACEMENT CONFIGURATION */}
          {!imageInfo ? (
            <div className="step-workflow-card secondary-card">
              <div className="step-badge-indicator">Step 2 of 2</div>
              <h2 className="step-header-title">Select Image to Insert or Overlay</h2>
              <p className="step-header-desc">
                Upload your signature, official stamp, photo, or company logo (JPG, PNG, or WEBP).
              </p>

              <div
                className={`drop-zone image-drop-zone ${isImgDragOver ? 'drag-over' : ''}`}
                onClick={() => imgInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsImgDragOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsImgDragOver(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsImgDragOver(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleImageFile(e.dataTransfer.files[0]);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="icon">🖼️</div>
                <p className="dropzone-main-text">Click or Drag Image here</p>
                <span className="dropzone-type-hint">Supports PNG (Transparent), JPG, JPEG & WEBP</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,.png,.jpg,.jpeg,.webp"
                  ref={imgInputRef}
                  onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])}
                  hidden
                />
              </div>
            </div>
          ) : (
            /* CONFIGURATION PANEL & MERGE ACTION */
            <div className="configuration-panel">
              <div className="config-header">
                <h3>Placement & Display Settings</h3>
                <button
                  type="button"
                  className="change-image-subtle-btn"
                  onClick={() => imgInputRef.current?.click()}
                >
                  Change Image
                </button>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  ref={imgInputRef}
                  onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])}
                  hidden
                />
              </div>

              <div className="config-grid">
                {/* Image Preview Box */}
                <div className="selected-image-card">
                  <div className="image-preview-thumb">
                    <img src={imageInfo.url} alt="Selected preview" />
                  </div>
                  <div className="image-card-info">
                    <span className="image-card-name" title={imageInfo.name}>{imageInfo.name}</span>
                    <span className="image-card-dims">
                      {imageInfo.width} × {imageInfo.height} px • {imageInfo.sizeFormatted}
                    </span>
                  </div>
                </div>

                {/* Controls Area */}
                <div className="controls-form">
                  {/* Page Target */}
                  <div className="form-group">
                    <label htmlFor="page-target-select">Apply to Page:</label>
                    <select
                      id="page-target-select"
                      className="styled-select"
                      value={pageTarget}
                      onChange={(e) => setPageTarget(e.target.value as PageTarget)}
                    >
                      <option value="first">Page 1 (First Page)</option>
                      {pdfInfo.pageCount > 1 && (
                        <option value="last">Page {pdfInfo.pageCount} (Last Page)</option>
                      )}
                      {pdfInfo.pageCount > 1 && (
                        <option value="specific">Choose Specific Page...</option>
                      )}
                      <option value="all">All Pages (Watermark / Header)</option>
                      <option value="new-page">Append as New Page at End</option>
                    </select>

                    {pageTarget === 'specific' && (
                      <div className="specific-page-row">
                        <span>Page number (1 - {pdfInfo.pageCount}):</span>
                        <input
                          type="number"
                          min={1}
                          max={pdfInfo.pageCount}
                          value={specificPageNumber}
                          onChange={(e) => setSpecificPageNumber(Math.max(1, Math.min(pdfInfo.pageCount, parseInt(e.target.value) || 1)))}
                          className="styled-number-input"
                        />
                      </div>
                    )}
                  </div>

                  {/* Position */}
                  {pageTarget !== 'new-page' && (
                    <div className="form-group">
                      <label htmlFor="position-select">Position / Placement:</label>
                      <select
                        id="position-select"
                        className="styled-select"
                        value={position}
                        onChange={(e) => setPosition(e.target.value as PlacementPosition)}
                      >
                        <option value="bottom-right">Bottom Right (Signature / Stamp)</option>
                        <option value="center">Center of Page</option>
                        <option value="top-center">Top Center (Header / Logo)</option>
                        <option value="bottom-center">Bottom Center (Footer)</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="top-right">Top Right</option>
                        <option value="top-left">Top Left</option>
                        <option value="fit">Fit to Page (Full Page Overlay)</option>
                      </select>
                    </div>
                  )}

                  {/* Size / Scale Slider */}
                  {position !== 'fit' && pageTarget !== 'new-page' && (
                    <div className="form-group">
                      <div className="label-with-val">
                        <label htmlFor="scale-slider">Image Size:</label>
                        <span className="val-pill">{scalePercent}%</span>
                      </div>
                      <input
                        id="scale-slider"
                        type="range"
                        min={10}
                        max={100}
                        step={5}
                        value={scalePercent}
                        onChange={(e) => setScalePercent(Number(e.target.value))}
                        className="styled-range"
                      />
                    </div>
                  )}

                  {/* Opacity Slider */}
                  <div className="form-group">
                    <div className="label-with-val">
                      <label htmlFor="opacity-slider">Opacity:</label>
                      <span className="val-pill">{opacityPercent}%</span>
                    </div>
                    <input
                      id="opacity-slider"
                      type="range"
                      min={10}
                      max={100}
                      step={5}
                      value={opacityPercent}
                      onChange={(e) => setOpacityPercent(Number(e.target.value))}
                      className="styled-range"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="merge-action-bar">
                <button
                  type="button"
                  className={`convert-btn merge-pdf-btn ${isProcessing ? 'loading' : ''}`}
                  onClick={handleMergeAndDownload}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Inserting Image & Compiling PDF...' : 'Insert Image & Download PDF'}
                </button>
                <button
                  type="button"
                  className="reset-workflow-btn"
                  onClick={handleReset}
                  disabled={isProcessing}
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
