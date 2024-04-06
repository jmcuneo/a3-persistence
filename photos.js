const multer = require("multer")
const { GridFsStorage } = require("multer-gridfs-storage")
require("dotenv").config()
const url = `mongodb+srv://ibixler:${process.env.DB_PW}@webware-a3-ibixler.fj4jqxh.mongodb.net/?retryWrites=true&w=majority&appName=webware-a3-ibixler/`

const storage = new GridFsStorage({
  url,
  file: (req, file) => {
    //If it is an image, save to photos bucket
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      return {
        bucketName: "photos",
        filename: `${Date.now()}_${file.originalname}`,
      }
    } else {
      //Otherwise save to default bucket
      return `${Date.now()}_${file.originalname}`
    }
  },
})

exports.upload = multer({ storage })
