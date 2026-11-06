export interface RouteSEOConfig {
  path: string;
  slug: string;
  name: string;
  shortName: string;
  badge: string;
  icon: string;
  documentTitle: string;
  metaDescription: string;
  headingPrefix: string;
  headingHighlight: string;
  headingSuffix?: string;
  subheading: string;
  fileAccept: string;
  acceptedTypesLabel: string;
  seoHeading: string;
  seoDescription: string;
  privacySummary: string;
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
  steps: {
    stepNumber: string;
    title: string;
    description: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
}

export const SEO_ROUTES_CONFIG: Record<string, RouteSEOConfig> = {
  '/': {
    path: '/',
    slug: 'images',
    name: 'Images to PDF',
    shortName: 'All Images',
    badge: 'Universal Converter',
    icon: '🖼️',
    documentTitle: '100% Free Image to PDF Converter Online - No Limits',
    metaDescription: 'Convert JPG, PNG, HEIC, and WEBP images to PDF online in seconds. 100% free, unlimited conversions, client-side privacy, and no file uploads required.',
    headingPrefix: '100% Free Images to ',
    headingHighlight: 'PDF Converter',
    subheading: '100% free, fast & secure image to PDF converter with drag-and-drop reordering. No signups, no watermarks, processed right in your browser.',
    fileAccept: 'image/*',
    acceptedTypesLabel: 'Supports JPG, PNG, HEIC, WEBP & more',
    seoHeading: 'Why Use Our Free In-Browser Image to PDF Converter?',
    seoDescription: 'Transform any collection of images into a single, beautifully formatted PDF document. Our tool processes all files 100% locally on your device, ensuring maximum speed and complete data privacy.',
    privacySummary: 'Your photos and documents never leave your computer or phone. Unlike traditional converters that upload your personal files to third-party cloud servers, our conversion engine runs directly in your browser using modern Web APIs and WebAssembly. No registration, no watermarks, no limits.',
    features: [
      {
        icon: '🔒',
        title: '100% Local Browser Privacy',
        description: 'Files are processed exclusively in your browser memory. Zero files are sent to any external server.'
      },
      {
        icon: '⚡',
        title: 'Instant & No File Limits',
        description: 'Convert as many images as you need without queue delays, file size restrictions, or throttling.'
      },
      {
        icon: '🖐️',
        title: 'Drag-and-Drop Reordering',
        description: 'Effortlessly rearrange images using intuitive drag-and-drop before creating your finalized PDF.'
      },
      {
        icon: '✨',
        title: 'Crisp High-Resolution Output',
        description: 'Maintains optimal image dimensions and aspect ratios for printing, archiving, or sharing.'
      }
    ],
    steps: [
      {
        stepNumber: '01',
        title: 'Select or Drop Images',
        description: 'Click the upload zone or drag and drop any image files (JPG, PNG, HEIC, WEBP) from your device.'
      },
      {
        stepNumber: '02',
        title: 'Arrange Page Sequence',
        description: 'Drag and reorder image cards until your PDF pages are organized in the exact order you want.'
      },
      {
        stepNumber: '03',
        title: 'Generate & Download PDF',
        description: 'Click "Convert to PDF" to instantly compile and download your document directly to your device.'
      }
    ],
    faq: [
      {
        question: 'Are my images uploaded to any remote server?',
        answer: 'No. Everything is rendered and converted directly inside your client browser using client-side JavaScript (jsPDF). Your files never touch a remote server.'
      },
      {
        question: 'Can I combine multiple different image formats in one PDF?',
        answer: 'Yes! You can mix JPG, PNG, WEBP, and HEIC files together and reorder them into a single unified PDF.'
      },
      {
        question: 'Is there a limit on how many files I can convert?',
        answer: 'There are no artificial limits. You can convert as many images as your browser memory can accommodate.'
      }
    ]
  },
  '/jpg-to-pdf': {
    path: '/jpg-to-pdf',
    slug: 'jpg',
    name: 'JPG to PDF',
    shortName: 'JPG / JPEG',
    badge: 'Most Popular',
    icon: '📸',
    documentTitle: 'Convert JPG to PDF Online - Free & Unlimited',
    metaDescription: 'Convert JPG and JPEG photos to high-quality PDF documents online. Free, unlimited, completely secure, and processed right inside your browser without uploads.',
    headingPrefix: 'Convert JPG to ',
    headingHighlight: 'PDF Free Online',
    subheading: 'Merge multiple JPG and JPEG photos into a clean PDF document 100% free with zero server uploads and no limits.',
    fileAccept: '.jpg,.jpeg,image/jpeg',
    acceptedTypesLabel: 'JPG and JPEG photos only',
    seoHeading: 'Free & Secure JPG to PDF Converter Online',
    seoDescription: 'Need to convert photographic JPG or JPEG files into an organized PDF? Our dedicated JPG to PDF tool packages your pictures into a lightweight, easily shareable PDF document while preserving original color fidelity.',
    privacySummary: 'Your sensitive photos, receipts, IDs, and records remain completely confidential. Processing occurs entirely in your browser using local JavaScript memory. Your files are never transmitted across the internet or stored on remote databases.',
    features: [
      {
        icon: '🔒',
        title: 'Zero Cloud Uploads',
        description: 'Full client-side conversion protects sensitive documents, ID cards, and personal photographs.'
      },
      {
        icon: '📐',
        title: 'True Aspect Ratio Preservation',
        description: 'Each JPG is fitted cleanly onto PDF pages without distorted dimensions or stretched graphics.'
      },
      {
        icon: '🚀',
        title: 'Batch JPG Conversion',
        description: 'Combine dozens of camera snapshots or scans into a single streamlined multi-page PDF.'
      },
      {
        icon: '🆓',
        title: 'No Paywalls or Watermarks',
        description: 'Enjoy 100% free conversions without forced watermarks, account registrations, or hidden fees.'
      }
    ],
    steps: [
      {
        stepNumber: '01',
        title: 'Add JPG / JPEG Files',
        description: 'Drop your JPG photos into the upload box or browse from your computer or smartphone.'
      },
      {
        stepNumber: '02',
        title: 'Order Your Pages',
        description: 'Drag photos into your preferred sequence to control page numbering in the output PDF.'
      },
      {
        stepNumber: '03',
        title: 'Download Clean PDF',
        description: 'Press convert to build your PDF file locally and save it immediately without waiting.'
      }
    ],
    faq: [
      {
        question: 'Does converting JPG to PDF reduce photo quality?',
        answer: 'Our converter embeds your JPG images directly into the PDF container at their original resolution, ensuring crisp clarity for printing or digital sharing.'
      },
      {
        question: 'Can I reorder JPG pages before converting?',
        answer: 'Yes! Simply drag and drop any image card in the preview grid to reorder pages before compiling.'
      }
    ]
  },
  '/png-to-pdf': {
    path: '/png-to-pdf',
    slug: 'png',
    name: 'PNG to PDF',
    shortName: 'PNG Graphics',
    badge: 'Lossless Quality',
    icon: '🎨',
    documentTitle: 'Free PNG to PDF Converter Online - High Quality',
    metaDescription: 'Convert transparent and high-resolution PNG images to crisp PDF files online for free. Keep maximum quality without compromising privacy.',
    headingPrefix: 'Convert PNG to ',
    headingHighlight: 'PDF Free Online',
    subheading: 'Transform crisp PNG graphics and screenshots into shareable PDF documents 100% free right in your browser.',
    fileAccept: '.png,image/png',
    acceptedTypesLabel: 'PNG image files only',
    seoHeading: 'High-Quality PNG to PDF Converter with Zero Server Uploads',
    seoDescription: 'PNG images often contain sharp typography, diagrams, and illustrations. Our browser-based PNG to PDF tool creates pristine PDF pages from your PNG graphics without blurring or compression artifacts.',
    privacySummary: 'We prioritize your privacy above all else. Your PNG files are processed locally within your browser sandbox. None of your graphic designs, business slides, or personal captures are ever uploaded or analyzed by third-party servers.',
    features: [
      {
        icon: '💎',
        title: 'Lossless Clarity',
        description: 'Ideal for screenshots, charts, diagrams, and vector-rendered art that demand sharp text.'
      },
      {
        icon: '🛡️',
        title: 'Strict Local Privacy',
        description: 'Files are read directly by your web browser and compiled into PDF without network transmissions.'
      },
      {
        icon: '⚡',
        title: 'Blazing Fast Processing',
        description: 'No waiting for cloud server queues. High-performance client-side rendering finishes in seconds.'
      },
      {
        icon: '📱',
        title: 'Cross-Device Compatible',
        description: 'Works smoothly on Windows, Mac, Linux, Chromebook, iPhone, iPad, and Android devices.'
      }
    ],
    steps: [
      {
        stepNumber: '01',
        title: 'Select PNG Files',
        description: 'Choose your PNG graphics, screenshots, or artwork by clicking or dragging onto the dropzone.'
      },
      {
        stepNumber: '02',
        title: 'Arrange Pages',
        description: 'Easily rearrange items in the visual grid using simple drag-and-drop actions.'
      },
      {
        stepNumber: '03',
        title: 'Save PDF Locally',
        description: 'Export your new PDF file instantly to your downloads folder with 100% confidentiality.'
      }
    ],
    faq: [
      {
        question: 'Are PNG transparencies preserved in the PDF?',
        answer: 'The converter places your PNG artwork onto clean white PDF backgrounds, maintaining sharp edges and lossless clarity.'
      },
      {
        question: 'Is there a limit on PNG file sizes?',
        answer: 'Since conversion takes place locally on your computer, there are no artificial file upload limits.'
      }
    ]
  },
  '/heic-to-pdf': {
    path: '/heic-to-pdf',
    slug: 'heic',
    name: 'HEIC to PDF',
    shortName: 'iPhone HEIC',
    badge: 'Apple / iOS Photos',
    icon: '📱',
    documentTitle: 'Convert iPhone HEIC to PDF Free - No Registration',
    metaDescription: 'Turn Apple iPhone HEIC/HEIF photos into universal PDF documents easily. Free online converter without registration or cloud uploads.',
    headingPrefix: 'Convert iPhone HEIC to ',
    headingHighlight: 'PDF Free',
    subheading: 'Convert iOS HEIC and HEIF camera pictures into universal PDF files 100% free with complete offline privacy.',
    fileAccept: '.heic,.heif,image/heic,image/heif',
    acceptedTypesLabel: 'Apple HEIC / HEIF photos only',
    seoHeading: 'Convert Apple iPhone HEIC Photos to Universal PDF',
    seoDescription: 'iPhones capture photos in High Efficiency Image Container (HEIC/HEIF) format, which can be difficult to view on non-Apple devices. Our HEIC to PDF converter packages your photos into standard PDFs that open anywhere.',
    privacySummary: 'Never risk uploading private camera roll memories to unknown cloud converters. Our application runs locally on your device, ensuring that family pictures, confidential receipts, and personal snapshots remain 100% private.',
    features: [
      {
        icon: '🍏',
        title: 'Made for Apple Photos',
        description: 'Directly accepts .heic and .heif images straight from your iPhone, iPad, or Mac photo library.'
      },
      {
        icon: '🔒',
        title: 'Complete Device Privacy',
        description: 'Personal photos are processed locally on your machine with zero server uploads.'
      },
      {
        icon: '📄',
        title: 'Universal PDF Format',
        description: 'Produce standard PDF files readable on any PC, Android, Kindle, or web browser.'
      },
      {
        icon: '🚀',
        title: 'No App Installation',
        description: 'No need to buy paid App Store software. Convert right here in your web browser for free.'
      }
    ],
    steps: [
      {
        stepNumber: '01',
        title: 'Choose HEIC Photos',
        description: 'Select your iPhone .heic or .heif images from your gallery or computer storage.'
      },
      {
        stepNumber: '02',
        title: 'Review & Reorder',
        description: 'Drag and rearrange your photo tiles to ensure chronological or logical page ordering.'
      },
      {
        stepNumber: '03',
        title: 'Download Standard PDF',
        description: 'Generate your universal PDF document instantly and share with anyone on any device.'
      }
    ],
    faq: [
      {
        question: 'Why convert HEIC to PDF instead of JPG?',
        answer: 'PDF is universally supported across Windows, Android, Linux, and all office software, making it the easiest format to share multiple iPhone photos at once.'
      },
      {
        question: 'Do I need to install any software or extensions?',
        answer: 'No plugins, extensions, or software installations are required. Everything operates directly in your modern web browser.'
      }
    ]
  },
  '/webp-to-pdf': {
    path: '/webp-to-pdf',
    slug: 'webp',
    name: 'WEBP to PDF',
    shortName: 'WEBP Images',
    badge: 'Modern Web Format',
    icon: '🌐',
    documentTitle: 'Convert WEBP to PDF Online - Fast & High Quality',
    metaDescription: 'Fast and easy WEBP to PDF conversion online. Combine modern web images into a standard PDF with client-side privacy and no size limits.',
    headingPrefix: 'Convert WEBP to ',
    headingHighlight: 'PDF Free Online',
    subheading: 'Convert modern Google WEBP format images into printable, high-resolution PDF pages 100% free in seconds.',
    fileAccept: '.webp,image/webp',
    acceptedTypesLabel: 'WEBP image files only',
    seoHeading: 'Fast & Secure WEBP to PDF Converter',
    seoDescription: 'WEBP is the modern standard for web imagery, but it is often tricky to print or include in formal documents. Our online converter turns your saved WEBP files into clean, professional PDF files right inside your browser.',
    privacySummary: 'All image rendering and PDF construction happen entirely within your local browser runtime. We never upload, save, or inspect your files on external web servers.',
    features: [
      {
        icon: '⚡',
        title: 'Instant In-Memory Rendering',
        description: 'Leverages browser canvas and jsPDF to compile WEBP files into PDF pages in milliseconds.'
      },
      {
        icon: '🔐',
        title: 'Private Client-Side Processing',
        description: 'Full privacy guarantee: your downloaded web graphics never leave your computer.'
      },
      {
        icon: '📑',
        title: 'Multi-Page Compilation',
        description: 'Merge multiple WEBP infographics, blog images, or product shots into a single document.'
      },
      {
        icon: '🖨️',
        title: 'Print & Share Ready',
        description: 'Generates standard A4/letter proportional PDF layouts ideal for sharing or printing.'
      }
    ],
    steps: [
      {
        stepNumber: '01',
        title: 'Upload WEBP Files',
        description: 'Drag and drop your WEBP images or browse files from your local storage.'
      },
      {
        stepNumber: '02',
        title: 'Order The Pages',
        description: 'Sort your images by dragging the thumbnail cards into the desired layout.'
      },
      {
        stepNumber: '03',
        title: 'Create Your PDF',
        description: 'Click convert to trigger client-side compilation and immediately save your PDF.'
      }
    ],
    faq: [
      {
        question: 'Can I print WEBP files after converting them to PDF?',
        answer: 'Yes! Standard PDF files can be opened and printed by any PDF viewer or printing utility without compatibility issues.'
      },
      {
        question: 'Is this WEBP to PDF tool free to use?',
        answer: 'Yes, it is 100% free with no registration, no subscription, and no watermarks.'
      }
    ]
  },
  '/add-image-to-pdf': {
    path: '/add-image-to-pdf',
    slug: 'add-image',
    name: 'Add Image to PDF',
    shortName: 'Add to PDF',
    badge: 'Insert & Overlay',
    icon: '➕',
    documentTitle: 'Add Image to PDF Online - 100% Free',
    metaDescription: 'Easily insert, overlay, stamp, or attach JPG and PNG images onto existing PDF documents online. 100% free, client-side privacy, and no file uploads.',
    headingPrefix: 'Add Image to ',
    headingHighlight: 'PDF Online',
    subheading: 'Insert, stamp, or overlay JPG and PNG images onto any existing PDF document 100% free with complete privacy.',
    fileAccept: '.pdf,application/pdf',
    acceptedTypesLabel: 'PDF Documents (.pdf)',
    seoHeading: 'Free Online Tool to Add Images into Existing PDFs',
    seoDescription: 'Need to add a signature, stamp, photo, or logo into an existing PDF document? Our browser-based tool allows you to insert and overlay images onto any page of your PDF without third-party cloud uploads or paid software subscriptions.',
    privacySummary: 'Your PDF documents and personal images never leave your computer or smartphone. All PDF modifications and image embedding operations occur entirely within your local browser runtime using WebAssembly and client-side JavaScript. No file uploads, no tracking, and 100% confidentiality.',
    features: [
      {
        icon: '🔒',
        title: 'Zero Server Uploads',
        description: 'Both your PDF and images are processed in-memory directly on your device.'
      },
      {
        icon: '🎯',
        title: 'Flexible Page Placement',
        description: 'Place images on specific pages, all pages, or append as a new page.'
      },
      {
        icon: '✍️',
        title: 'Signatures & Stamps',
        description: 'Perfect for adding transparent PNG signatures, company logos, and official stamps.'
      },
      {
        icon: '⚡',
        title: 'Instant Download',
        description: 'Export your updated PDF file instantly with zero watermarks or signup requirements.'
      }
    ],
    steps: [
      {
        stepNumber: '01',
        title: 'Upload Existing PDF',
        description: 'Select or drag your PDF document into the upload dropzone to inspect pages.'
      },
      {
        stepNumber: '02',
        title: 'Upload Image to Insert',
        description: 'Select the JPG or PNG image, signature, or photo you want to place onto the document.'
      },
      {
        stepNumber: '03',
        title: 'Configure & Save',
        description: 'Select target page, position, and sizing, then click "Insert & Download PDF".'
      }
    ],
    faq: [
      {
        question: 'Can I add transparent PNG signatures to my PDF?',
        answer: 'Yes! Transparent PNG files are fully supported, making it easy to sign contracts or add transparent watermarks without white backgrounds.'
      },
      {
        question: 'Does this tool upload my PDF to any server?',
        answer: 'No. The entire process runs locally in your browser using pdf-lib. Your documents remain strictly on your device.'
      },
      {
        question: 'Can I choose which page the image appears on?',
        answer: 'Yes. You can select Page 1, Last Page, any specific page number, or apply the image to all pages simultaneously.'
      }
    ]
  }
};

export const ALL_TOOL_ROUTES = Object.values(SEO_ROUTES_CONFIG);
