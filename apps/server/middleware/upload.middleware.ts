import multer from "multer";
//Multer acts as middleware that receives the multipart request and extracts the file.

 export const avatarUpload = multer({
    storage: multer.memoryStorage(),// memoryStorage() tells multer to keep the uploaded file in memory

 limits:{
    fileSize: 5*1024*1024, // this is 5MB because 1MB is 1024 x 1024 bytes
 },

 fileFilter: (req, file, cb) => {   //filefilter: Multer calls this when a file is received. 
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
    ];

  if(allowedTypes.includes(file.mimetype)){ //file.mimetype: tells us the file's reported MIME type.
    cb(null,true); //cb(null, true): accept the file.
  } else {
    cb(new Error("only JPEG,PNG and WebP image are allowed"));  //cb(error): reject it and pass an error onward.
  }


 }

});

// later , when a request passes through this middleware , we'll access the iamge through req.file.
// the actual image bytes will be in req.file.buffer.

//req	Express request object — contains request information.

//file	Information about the uploaded file.

//cb	Callback function we call to tell Multer what to do.