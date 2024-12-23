import multer from "multer";
import AWS from 'aws-sdk';

// Set up AWS SDK for Wasabi (S3-compatible)
const s3 = new AWS.S3({
    endpoint: 'https://s3.wasabisys.com', // Wasabi endpoint
    accessKeyId: 'PEEOK0E4KDU4Q5EIOZVF',    // Wasabi access key
    secretAccessKey: 'BmQzYV9Ndb8mfnOCF5jQeKMBdE71ozWstZKpq4pI', // Wasabi secret key
    region: 'us-east-1',                   // Wasabi region
});


// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './files'); 
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname); 
//     },
// });
const storage = multer.memoryStorage(); // Store the file in memory

export const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, 
}).single('file'); 
