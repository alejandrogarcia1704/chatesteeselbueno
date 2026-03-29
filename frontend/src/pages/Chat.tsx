import {
  IonPage,
  IonContent,
  IonFooter,
  IonInput,
  IonButton
} from "@ionic/react"
import { useState, useEffect, useRef } from "react"
import { io } from "socket.io-client"
import api from "../services/api"

const socket = io("http://localhost:5000")

interface Message{
  id:number
  sender_id:number
  receiver_id:number
  message:string
  file:string | null
  type:"text"|"image"|"video"|"file"
}

export default function Chat(){

const [messages,setMessages]=useState<Message[]>([])
const [text,setText]=useState("")
const [file,setFile]=useState<File | null>(null)

const my=1
const other=2

const bottomRef = useRef<HTMLDivElement>(null)

useEffect(()=>{

api.get(`/chat/messages/${my}/${other}`)
.then(res=>setMessages(res.data))

socket.on("newMessage",(msg)=>{
 setMessages(prev=>[...prev,msg])
})

},[])

useEffect(()=>{
 bottomRef.current?.scrollIntoView({behavior:"smooth"})
},[messages])

const sendMessage=async()=>{

const form=new FormData()

form.append("sender",String(my))
form.append("receiver",String(other))
form.append("message",text)

if(file){
 form.append("file",file)
}

await api.post("/chat/send",form)

socket.emit("sendMessage",{message:text})

setText("")
setFile(null)

}

return(

<IonPage>

<IonContent className="chat-content">

{messages.map(m=>{

const isMe = m.sender_id==my

return(
<div key={m.id} className={`message ${isMe?"me":"other"}`}>

{m.type==="text" && <p>{m.message}</p>}

{m.type==="image" &&
<img src={`http://localhost:5000/uploads/${m.file}`} />}

{m.type==="video" &&
<video src={`http://localhost:5000/uploads/${m.file}`} controls />}

{m.type==="file" &&
<a href={`http://localhost:5000/uploads/${m.file}`} download>
📎 Descargar archivo
</a>}

</div>
)

})}

<div ref={bottomRef}></div>

</IonContent>

<IonFooter className="chat-footer">

<div className="input-container">

<IonInput
value={text}
placeholder="Escribe mensaje..."
onIonChange={e=>setText(e.detail.value!)}
/>

<input
type="file"
onChange={(e)=>{
const files=e.target.files
if(files) setFile(files[0])
}}
/>

<IonButton onClick={sendMessage}>Enviar</IonButton>

</div>

</IonFooter>

</IonPage>

)

}