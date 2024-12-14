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