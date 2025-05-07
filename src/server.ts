import http from 'http';
import dotenv from "dotenv";
import { handleRequest } from './routes';

dotenv.config();
const PORT = process.env.PORT || 4000;

const server = http.createServer(handleRequest)

server.listen(PORT,() => console.log(`Server is running on port ${PORT}`))