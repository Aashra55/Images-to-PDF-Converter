import { useState, useRef } from 'react';
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
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './App.css';

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
    isDragging
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
      <div className="drag-handle" {...attributes} {...listeners}>
        <img src={img.url} alt="preview" />
      </div>
      <button className="remove-btn" onClick={() => onRemove(img.id)}>×</button>
    </div>
  );
}

function App() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newImages: ImageData[] = newFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        url: URL.createObjectURL(file),
        file,
      }));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return filtered;
    });
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
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        let imgWidth = img.width;
        let imgHeight = img.height;
        
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

      pdf.save('converted.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Images to <span className="highlight">PDF</span></h1>
        <p>Modern & Sleek Image Converter</p>
      </header>

      <main>
        <div 
          className="drop-zone"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="icon">📸</div>
          <p>Click or Drag images here to upload</p>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handleFileChange} 
            ref={fileInputRef}
            hidden
          />
        </div>

        {images.length > 0 && (
          <div className="preview-section">
            <div className="reorder-hint">
              <span>💡 Drag images to reorder</span>
            </div>
            
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={images.map(img => img.id)}
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
              {isGenerating ? 'Generating PDF...' : `Convert ${images.length} Image${images.length > 1 ? 's' : ''} to PDF`}
            </button>
          </div>
        )}
      </main>

      <footer>
        <p>Built with React, jsPDF & dnd-kit</p>
      </footer>
    </div>
  );
}

export default App;
