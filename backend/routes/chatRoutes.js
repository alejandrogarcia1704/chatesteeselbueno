const express=require("express")
const router=express.Router()

const chat=require("../controllers/chatController")

router.post("/send",chat.uploadMiddleware,chat.sendMessage)

router.get("/messages/:my/:other",chat.getMessages)

module.exports=router