// import multer from "multer";
// import AWS from 'aws-sdk';

// // Set up AWS SDK for Wasabi (S3-compatible)
// const s3 = new AWS.S3({
//     endpoint: 'https://s3.wasabisys.com', // Wasabi endpoint
//     accessKeyId: 'PEEOK0E4KDU4Q5EIOZVF',    // Wasabi access key
//     secretAccessKey: 'BmQzYV9Ndb8mfnOCF5jQeKMBdE71ozWstZKpq4pI', // Wasabi secret key
//     region: 'us-east-1',                   // Wasabi region
// });


// // const storage = multer.diskStorage({
// //     destination: (req, file, cb) => {
// //         cb(null, './files'); 
// //     },
// //     filename: (req, file, cb) => {
// //         cb(null, file.originalname); 
// //     },
// // });
// const storage = multer.memoryStorage(); // Store the file in memory

// export const upload = multer({
//     storage,
//     limits: { fileSize: 10 * 1024 * 1024 }, 
// }).single('file'); 

import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';

// Set up AWS SDK for Wasabi (S3-compatible)
const s3 = new AWS.S3({
    endpoint: 'https://s3.wasabisys.com',
    accessKeyId: process.env.WASABI_ACCESS_KEY,
    secretAccessKey: process.env.WASABI_SECRET_KEY,
    region: 'us-east-1',
});

// Multer configuration for uploading to Wasabi
export const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "fitness-tracker",     // Your Wasabi bucket name
        acl: 'public-read',                         // Adjust ACL as needed
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, `files/${Date.now()}_${file.originalname}`);
        },
    }),
    limits: { fileSize: 10 * 1024 * 1024 },         // 10 MB file size limit
}).single("file")


