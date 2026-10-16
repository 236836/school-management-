// backend/config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for Profile Photos
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'school-management/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill' }]
  }
});

// Storage for Assignment Files
const assignmentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'school-management/assignments',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
    resource_type: 'auto'
  }
});

// Storage for Documents
const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'school-management/documents',
    allowed_formats: ['pdf', 'doc', 'docx', 'ppt', 'pptx'],
    resource_type: 'auto'
  }
});

export const uploadProfile = multer({ 
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export const uploadAssignment = multer({ 
  storage: assignmentStorage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

export const uploadDocument = multer({ 
  storage: documentStorage,
  limits: { fileSize: 20 * 1024 * 1024 }
});

export { cloudinary };