const db=require("../config/db")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")

exports.register=(req,res)=>{

 const {name,email,password}=req.body

 const hash=bcrypt.hashSync(password,10)

 db.query(
 "INSERT INTO users(name,email,password) VALUES(?,?,?)",
 [name,email,hash],
 (err,result)=>{

  if(err) return res.status(500).json(err)

  res.json({status:"usuario creado"})

 })

}

exports.login=(req,res)=>{

 const {email,password}=req.body

 db.query(
 "SELECT * FROM users WHERE email=?",
 [email],
 (err,result)=>{

  if(err) return res.status(500).json(err)

  if(result.length===0)
   return res.status(401).json({error:"usuario no existe"})

  const user=result[0]

  const valid=bcrypt.compareSync(password,user.password)

  if(!valid)
   return res.status(401).json({error:"password incorrecto"})

  const token=jwt.sign(
   {id:user.id},
   "CLAVE_SECRETA",
   {expiresIn:"1d"}
  )

  res.json({
   id:user.id,
   name:user.name,
   email:user.email,
   token
  })

 })

}