import {IonPage,IonInput,IonButton} from "@ionic/react"
import {useState} from "react"
import api from "../services/api"

export default function Login(){

const[email,setEmail]=useState("")
const[password,setPassword]=useState("")

const login=async()=>{

const res=await api.post("/auth/login",{email,password})

localStorage.setItem("user",JSON.stringify(res.data))

window.location.href="/chat"

}

return(

<IonPage>

<h2>Login</h2>

<IonInput placeholder="email" onIonChange={e=>setEmail(e.detail.value!)} />

<IonInput type="password" placeholder="password"
onIonChange={e=>setPassword(e.detail.value!)} />

<IonButton onClick={login}>Login</IonButton>

</IonPage>

)

}