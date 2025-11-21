# 🔍 SmartPanda OCR Transcript Extraction App

A modern, dark-themed web application for extracting structured data from transcript documents using Google's Gemini AI, with visual highlighting to show exactly where each data point was extracted from.

![Demo](https://img.shields.io/badge/Status-Production_Ready-success)
![AI](https://img.shields.io/badge/AI-Gemini_2.0_Flash-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🎨 Modern Dark UI
- Sleek, polished dark theme optimized for extended use
- Responsive design that works on desktop and tablet
- Smooth animations and transitions
- Professional color scheme with purple/blue accents

### 🤖 AI-Powered OCR
- Uses Google Gemini 2.0 Flash (or Pro Vision) for document analysis
- Intelligent extraction of structured data from transcripts
- High accuracy with confidence scoring
- Supports multiple document types (transcripts, invoices, medical records)

### 📍 Visual Highlighting
- Interactive overlays showing exact location of extracted data
- Hover over extracted data to highlight source location
- Click on highlights to jump to corresponding data row
- Color-coded highlights for easy identification

### 📊 Dual-Panel View
- **Left Panel**: Document viewer with zoom controls and visual overlays
- **Right Panel**: Extracted data in clean, sortable table format
- Synchronized highlighting between document and data
- Easy navigation between dashboard and viewer

### 📁 Document Management
- Dashboard with filterable document list
- Status tracking (Waiting Review, Complete)
- Confidence scores for each extraction
- Batch processing capabilities

## 🚀 Getting Started

### Prerequisites

1. **Google Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Keep it secure (never commit to Git)

2. **Modern Web Browser**
   - Chrome 90+
   - Firefox 88+
   - Safari 14+
   - Edge 90+

### Installation

#### Option 1: Simple HTML (No Server Required)

1. Clone or download this repository:
```bash
git clone https://github.com/your-username/ocr-transcript-app.git
cd ocr-transcript-app
```

2. Open `ocr-transcript-app.html` directly in your browser:
```bash
# On macOS
open ocr-transcript-app.html

# On Linux
xdg-open ocr-transcript-app.html

# On Windows
start ocr-transcript-app.html
```

3. Enter your Gemini API key in the configuration section

#### Option 2: Local Web Server (Recommended)

For better file handling and security:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then open: `http://localhost:8000/ocr-transcript-app.html`

### Configuration

1. **Add Your API Key**
   - Click on the "🔑 Gemini API Configuration" section
   - Paste your API key
   - It will be saved to browser localStorage

2. **Upload a Document**
   - Drag and drop a transcript image (PNG, JPG, PDF)
   - Or click the upload zone to browse files
   - Maximum file size: 10MB

3. **Process the Document**
   - Click "Process Document" button
   - Wait for AI analysis (typically 3-10 seconds)
   - View extracted data with visual highlighting

## 📖 Usage Guide

### Dashboard View

The main dashboard shows all processed and pending documents:

- **Search**: Filter documents by name, student, or school
- **Filters**: Filter by status (Waiting Review, Complete) or document type
- **Table Actions**:
  - Click filename to open document viewer
  - View icon (👁️) to see details
  - Download icon (⬇️) to export data

### Document Viewer

Split-screen interface for document analysis:

**Left Panel - Document View**
- View the original document image
- Visual overlays show extraction regions
- Zoom in/out controls
- Hover over highlighted regions to see what was extracted

**Right Panel - Extracted Data**
- Structured table with all extracted information
- For transcripts: Year, Term, Subject, Catalog, Title, Units, Grade
- Hover over rows to highlight source location in document
- Export data to CSV or JSON

### Visual Highlighting System

The app creates an interactive connection between extracted data and source document:

1. **Hover on Data Row** → Highlights corresponding region in document
2. **Click Highlight Box** → Scrolls to and highlights data row
3. **Color Coding** → Different colors for different data types

## 🔧 API Integration

### Gemini API Setup

The app uses Google's Gemini API for OCR processing. Here's how it works:

```javascript
// API call structure
const response = await fetch(
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=YOUR_API_KEY',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: "Extract course data from this transcript..." },
          { inline_data: { mime_type: 'image/jpeg', data: base64Image } }
        ]
      }]
    })
  }
);
```

### Customizing Extraction

Edit `gemini-api.js` to customize extraction for different document types:

```javascript
// Add new document type
const prompts = {
  transcript: '...',
  invoice: '...',
  medical: '...',
  yourCustomType: 'Your custom extraction prompt...'
};
```

### Response Format

Gemini returns structured JSON:

```json
{
  "courses": [
    {
      "year": "2013",
      "term": "FALL",
      "subject": "MATH",
      "catalog": "1301",
      "title": "College Algebra",
      "units": "3",
      "grade": "A",
      "boundingBox": {
        "x": 15.5,
        "y": 25.3,
        "width": 70.0,
        "height": 3.5
      }
    }
  ],
  "studentInfo": {
    "name": "John Doe",
    "studentId": "123456",
    "institution": "State University"
  }
}
```

## 🎨 Customization

### Theme Colors

Edit CSS variables in `ocr-transcript-app.html`:

```css
:root {
    --bg-primary: #0f0f23;      /* Main background */
    --bg-secondary: #1a1a2e;    /* Card backgrounds */
    --accent-primary: #667eea;   /* Primary accent */
    --accent-secondary: #764ba2; /* Secondary accent */
    --text-primary: #e4e4e7;    /* Main text */
    --text-secondary: #a1a1aa;  /* Secondary text */
}
```

### Document Types

Add support for new document types:

1. Update `getPromptForDocumentType()` in `gemini-api.js`
2. Add new filter option in dashboard
3. Customize data table columns for your document type

## 📊 Data Export

Export extracted data in multiple formats:

- **CSV**: For spreadsheet applications
- **JSON**: For programmatic access
- **PDF Report**: Formatted extraction report

Click the save icon (💾) in the data panel header.

## 🔒 Security & Privacy

- **API Keys**: Stored only in browser localStorage (never sent to any server except Google)
- **Documents**: Processed entirely client-side, sent only to Google's Gemini API
- **Data Storage**: All data remains in your browser unless explicitly exported
- **No Backend**: Pure frontend app, no data leaves your control

### Best Practices

1. Never commit your API key to version control
2. Use environment variables in production
3. Rotate API keys regularly
4. Monitor API usage in Google Cloud Console
5. Consider rate limiting for production deployments

## 🐛 Troubleshooting

### Common Issues

**"Please enter your Gemini API key first"**
- Make sure you've entered a valid API key
- Check that key starts with "AIza"
- Verify key is active in Google Cloud Console

**"Error processing document"**
- Check internet connection
- Verify API key is valid and has quota remaining
- Ensure document is under 10MB
- Try with a clearer, higher-resolution image

**Visual highlights not appearing**
- Make sure document has been processed (click "Process Document")
- Check that Gemini returned bounding box coordinates
- Verify image is properly loaded

**Poor extraction accuracy**
- Use higher resolution images (300 DPI or better)
- Ensure text is clear and not skewed
- Avoid handwritten documents (use typed/printed only)
- Try adjusting the prompt in `gemini-api.js`

## 📈 Performance Tips

1. **Image Optimization**
   - Use JPEG format for photographs
   - PNG for documents with text
   - Compress images before upload (maintain 300 DPI)

2. **API Optimization**
   - Batch process multiple documents
   - Cache results in localStorage
   - Use Gemini Flash (faster) vs Pro (more accurate)

3. **Browser Performance**
   - Clear cache if processing many documents
   - Close other tabs to free memory
   - Use Chrome for best performance

## 🛠️ Development

### Project Structure

```
ocr-transcript-app/
├── ocr-transcript-app.html    # Main application (HTML/CSS/JS)
├── gemini-api.js              # API integration module
├── OCR_README.md              # This file
├── andragogy-detective-game.html  # Original game (kept for reference)
└── README.md                   # Original README
```

### Adding Features

1. **New Document Type**
   - Add prompt in `gemini-api.js`
   - Create new table structure
   - Add filter option

2. **Export Formats**
   - Add export function in main HTML
   - Create format converter
   - Add download button

3. **Advanced OCR**
   - Integrate Tesseract.js for offline OCR
   - Add preprocessing (deskew, denoise)
   - Implement multi-page support

### Running Tests

```bash
# Install dependencies
npm install

# Run unit tests
npm test

# Run integration tests
npm run test:integration
```

## 📚 Resources

- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Gemini API Quickstart](https://ai.google.dev/tutorials/get_started_web)
- [Best Practices for Prompting](https://ai.google.dev/docs/prompting_with_media)
- [Vision AI Guide](https://ai.google.dev/tutorials/document_understanding)

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for powerful OCR capabilities
- SmartPanda UI design inspiration
- Inter font family for beautiful typography

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/ocr-transcript-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/ocr-transcript-app/discussions)
- **Email**: support@yourapp.com

## 🗺️ Roadmap

- [ ] Multi-page document support
- [ ] Batch processing with queue
- [ ] Export to Excel/Google Sheets
- [ ] Offline OCR with Tesseract.js
- [ ] Mobile app version
- [ ] Cloud storage integration
- [ ] Collaboration features
- [ ] Advanced analytics dashboard

---

**Built with ❤️ for educational institutions and document processing needs**

Version: 1.0.0 | Last Updated: November 2025
