const multer = require("multer");
const path = require("path");

//SET STORAGE ENGINE
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});
module.exports = {
  upload: new multer({
    storage: storage,
    limits: { fileSize: 10000000 },
    fileFilter: function(req, file, cb) {
      checkFileType(file, cb);
    }
  }).single("photo")
};
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  //check ext
  const extname = filetypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  //check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

//MULTER SETUP

//INITIALIZE UPLOAD

//CHECK FILE TYPE
