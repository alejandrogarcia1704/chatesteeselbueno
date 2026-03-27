const db=require("../config/db") 
const multer=require("multer")

const storage=multer.diskStorage({
 destination:(req,file,cb)=>{
  cb(null,"uploads/")
 },
 filename:(req,file,cb)=>{
  cb(null,Date.now()+"-"+file.originalname)
 }
})

const upload=multer({storage})

exports.uploadMiddleware=upload.single("file")

exports.sendMessage=(req,res)=>{

 let file=null
 let type="text"

 if(req.file){

   file=req.file.filename
   const ext=file.split(".").pop().toLowerCase()

   if(["jpg","jpeg","png"].includes(ext)) type="image"
   else if(["mp4","webm"].includes(ext)) type="video"
   else type="file"

 }

 db.query(
  "INSERT INTO messages(sender_id,receiver_id,message,file,type) VALUES(?,?,?,?,?)",
  [
   req.body.sender,
   req.body.receiver,
   req.body.message,
   file,
   type
  ],
  (err)=>{
   if(err) return res.status(500).json(err)
   res.json({status:"ok"})
  }
 )

}

exports.getMessages = (req,res)=>{

 const my = req.params.my
 const other = req.params.other

 db.query(
 `SELECT * FROM messages 
  WHERE (sender_id=? AND receiver_id=?)
  OR (sender_id=? AND receiver_id=?)
  ORDER BY id ASC`,
 [my,other,other,my],
 (err,result)=>{

  if(err) return res.status(500).json(err)

  res.json(result)

 })

}