const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and images are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Middleware for multiple files (for question prediction)
const uploadMultiple = upload.array('files', 5); // Max 5 files

// Middleware for single file (for chat assistant)
const uploadSingle = upload.single('image');

// More flexible middleware that accepts different field names
const uploadFlexible = upload.any(); // Accepts any field name

// Simple file upload middleware that works with any field name
const simpleFileUpload = (req, res, next) => {
  // Skip if not multipart
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
    console.log('Not multipart request, skipping file upload middleware');
    return next();
  }
  
  console.log('Processing multipart request...');
  let data = Buffer.alloc(0);
  
  req.on('data', chunk => {
    data = Buffer.concat([data, chunk]);
  });
  
  req.on('end', () => {
    try {
      console.log('Total data received:', data.length, 'bytes');
      
      const boundary = req.headers['content-type'].split('boundary=')[1];
      console.log('Boundary:', boundary);
      
      const parts = data.toString('binary').split('--' + boundary);
      console.log('Number of parts:', parts.length);
      
      const files = [];
      const fields = {};
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        console.log(`Processing part ${i}:`, part.substring(0, 100) + '...');
        
        if (part.includes('Content-Disposition: form-data')) {
          const lines = part.split('\r\n');
          let fieldName = '';
          let fileName = '';
          let contentType = '';
          let contentStart = -1;
          
          for (let j = 0; j < lines.length; j++) {
            const line = lines[j];
            if (line.startsWith('Content-Disposition:')) {
              const nameMatch = line.match(/name="([^"]+)"/);
              const filenameMatch = line.match(/filename="([^"]+)"/);
              if (nameMatch) fieldName = nameMatch[1];
              if (filenameMatch) fileName = filenameMatch[1];
              console.log('Field name:', fieldName, 'File name:', fileName);
            }
            if (line.startsWith('Content-Type:')) {
              contentType = line.split(': ')[1];
              console.log('Content type:', contentType);
            }
            if (line === '' || line === '\r\n') {
              contentStart = j + 1;
              break;
            }
          }
          
          if (contentStart > 0) {
            const content = lines.slice(contentStart).join('\r\n').replace(/\r\n$/, '');
            console.log('Content length:', content.length);
            
            if (fileName) {
              files.push({
                fieldname: fieldName || 'file',
                originalname: fileName,
                mimetype: contentType || 'application/octet-stream',
                buffer: Buffer.from(content, 'binary')
              });
              console.log('Added file:', fileName);
            } else if (fieldName) {
              fields[fieldName] = content;
              console.log('Added field:', fieldName);
            }
          }
        }
      }
      
      req.files = files;
      req.body = fields;
      console.log('Final parsed files:', files.length);
      console.log('Final parsed fields:', Object.keys(fields));
      next();
    } catch (error) {
      console.error('File parsing error:', error);
      req.files = [];
      req.body = {};
      next();
    }
  });
};

// Error handling wrapper for multer
const handleMulterError = (uploadMiddleware) => {
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({ message: 'Too many files. Maximum is 5 files.' });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({ message: 'Unexpected file field.' });
        }
        return res.status(400).json({ message: 'File upload error: ' + err.message });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  };
};

module.exports = {
  uploadMultiple,
  uploadSingle,
  uploadFlexible,
  handleMulterError,
  simpleFileUpload
}; 