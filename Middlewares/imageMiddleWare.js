import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './files'); 
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); 
    },
});

export const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, 
}).single('file'); 

// import multer from 'multer';
// import fs from 'fs';
// // import Posts from '../Models/PostModel.js';

// // Ensure the directory exists
// if (!fs.existsSync('./files')) {
//     fs.mkdirSync('./files', { recursive: true });
// }

// // Configure Multer Storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './files');
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, `${uniqueSuffix}-${file.originalname}`);
//     },
// });

// // File filter to allow only images
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only image files are allowed!'), false);
//     }
// };

// // Multer configuration
// export const upload = multer({
//     storage,
//     limits: { fileSize: 10 * 1024 * 1024 }, 
//     fileFilter,
// }).single('file');
