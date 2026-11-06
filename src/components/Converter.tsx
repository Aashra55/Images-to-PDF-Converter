import { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { RouteSEOConfig } from '../config/seoRoutes';

interface ImageData {
  id: string;
  url: string;
  file: File;
}

interface SortableItemProps {
  id: string;
  img: ImageData;
  onRemove: (id: string) => void;
}

function SortableItem({ id, img, onRemove }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`image-card ${isDragging ? 'dragging' : ''}`}
    >
      <div className="drag-handle" {...attributes} {...listeners} title="Drag to reorder page">
        <img src={img.url} alt={img.file.name || 'preview'} />
        <span className="file-name-overlay">{img.file.name}</span>
      </div>
      <button
        type="button"
        className="remove-btn"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(img.id);
        }}
        aria-label="Remove image"
        title="Remove page"
      >
        ×
      </button>
    </div>
  );
}

interface ConverterProps {
  config: RouteSEOConfig;
}

export function Converter({ config }: ConverterProps) {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [formatNotice, setFormatNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Clear notice after 4 seconds
  useEffect(() => {
    if (formatNotice) {
      const timer = setTimeout(() => setFormatNotice(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [formatNotice]);

  const processFiles = (rawFiles: File[]) => {
    if (rawFiles.length === 0) return;

    let validFiles = rawFiles;

    // Filter by allowed extensions if not generic image/*
    if (config.fileAccept !== 'image/*') {
      const allowedExts = config.fileAccept
        .split(',')
        .map((ext) => ext.trim().toLowerCase());

      validFiles = rawFiles.filter((file) => {
        const fileName = file.name.toLowerCase();
        const fileType = file.type.toLowerCase();
        return allowedExts.some((ext) => {
          if (ext.startsWith('.')) {
            return fileName.endsWith(ext);
          }
          return fileType === ext;
        });
      });

      if (validFiles.length < rawFiles.length) {
        setFormatNotice(
          `Only ${config.acceptedTypesLabel} are allowed on this page. Non-matching files were skipped.`
        );
      }
    }

    if (validFiles.length === 0) return;

    const newImages: ImageData[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      url: URL.createObjectURL(file),
      file,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
      // Reset input value so re-selecting same files triggers change event
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return filtered;
    });
  };

  const clearAllImages = () => {
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setImages([]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const generatePDF = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);

    try {
      const pdf = new jsPDF();

      for (let i = 0; i < images.length; i++) {
        const imgData = images[i];
        const img = new Image();
        img.src = imgData.url;

        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = () => {
            // In case of unsupported browser decoding
            console.warn(`Could not load image: ${imgData.file.name}`);
            resolve(null);
          };
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        let imgWidth = img.width || 800;
        let imgHeight = img.height || 600;

        const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
        imgWidth *= ratio;
        imgHeight *= ratio;

        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;

        if (i > 0) {
          pdf.addPage();
        }

        pdf.addImage(img, 'JPEG', x, y, imgWidth, imgHeight);
      }

      const outputFileName = `${config.slug}-to-pdf.pdf`;
      pdf.save(outputFileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="converter-wrapper">
      {/* Dynamic Header & SEO Hero Title */}
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
          {config.headingSuffix || ''}
        </h1>
        <p className="hero-subheading">{config.subheading}</p>
      </header>

      {/* Main Dropzone & Upload Engine */}
      <div
        className={`drop-zone ${isDraggingOver ? 'drag-over' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            fileInputRef.current?.click();
          }
        }}
        aria-label="Upload images dropzone"
      >
        <div className="icon">📸</div>
        <p className="dropzone-main-text">Click or Drag images here to upload</p>
        <span className="dropzone-type-hint">{config.acceptedTypesLabel}</span>

        {/* Dynamic accept attribute reflecting current route */}
        <input
          type="file"
          multiple
          accept={config.fileAccept}
          onChange={handleFileChange}
          ref={fileInputRef}
          hidden
        />
      </div>

      {/* Validation notice if user dropped wrong file format on dedicated page */}
      {formatNotice && (
        <div className="format-notice-banner" role="alert">
          <span>⚠️ {formatNotice}</span>
          <button
            type="button"
            className="notice-close"
            onClick={() => setFormatNotice(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* Preview, DND-Kit Reorder Grid & PDF Download Button */}
      {images.length > 0 && (
        <div className="preview-section">
          <div className="preview-toolbar">
            <div className="reorder-hint">
              <span>💡 Drag images to reorder PDF page sequence</span>
            </div>
            <button
              type="button"
              className="clear-all-btn"
              onClick={clearAllImages}
              title="Remove all uploaded images"
            >
              Clear All ({images.length})
            </button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((img) => img.id)}
              strategy={rectSortingStrategy}
            >
              <div className="image-grid">
                {images.map((img) => (
                  <SortableItem
                    key={img.id}
                    id={img.id}
                    img={img}
                    onRemove={removeImage}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <button
            className={`convert-btn ${isGenerating ? 'loading' : ''}`}
            onClick={generatePDF}
            disabled={isGenerating}
          >
            {isGenerating
              ? 'Generating PDF...'
              : `Convert ${images.length} ${
                  images.length === 1 ? 'Image' : 'Images'
                } to PDF`}
          </button>
        </div>
      )}
    </div>
  );
}
