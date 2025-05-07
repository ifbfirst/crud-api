import http from 'http';
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 4000;

const server = http.createServer((req,res)=>{
res.writeHead(200,{"Content-type":"application/json"});
res.end(JSON.stringify({ message: "CRUD API works!" }))
})

server.listen(PORT,() => console.log(`Server is running on port ${PORT}`))