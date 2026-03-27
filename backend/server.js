const express = require("express")
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")

// 1️⃣ Crear app primero
const app = express()

// 2️⃣ Middlewares
app.use(cors())
app.use(express.json())

// 3️⃣ Archivos estáticos
app.use("/uploads", express.static("uploads"))

// 4️⃣ Crear servidor
const server = http.createServer(app)

// 5️⃣ Socket.IO
const io = new Server(server, {
 cors: { origin: "*" }
})

io.on("connection", (socket) => {
 console.log("Usuario conectado")

 socket.on("sendMessage", (data) => {
  io.emit("newMessage", data)
 })
})

// 6️⃣ IMPORTAR RUTAS (después de crear app)
const authRoutes = require("./routes/authRoutes")
const chatRoutes = require("./routes/chatRoutes")

// 7️⃣ USAR RUTAS
app.use("/api/auth", authRoutes)
app.use("/api/chat", chatRoutes)

// 8️⃣ Iniciar servidor
server.listen(5000, () => {
 console.log("Servidor corriendo en puerto 5000")
})