import url from "url";
import { users } from "./db";
import { v4 as uuidv4 } from "uuid";

export const handleRequest = (req: any, res: any) => {
  const parsedUrl = url.parse(req.url!, true);
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET") {
    if (parsedUrl.pathname === "/users") {
      res.end(JSON.stringify(users));
    } else if (parsedUrl.pathname?.startsWith("/users/")) {
      const id = parsedUrl.pathname.split("/")[2];
      
      const user = users.find((user) =>user.id === id);
      
      if (!user) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "User is not found" }));
        return; 
      }
      res.end(JSON.stringify(user));
    }
  } 
  else if (req.method === "POST" && parsedUrl.pathname === "/users") {
    let body = "";
    req.on("data", (chunk: string) => (body += chunk));
    req.on("end", () => {
      const parsedBody = JSON.parse(body);
  
      if (!parsedBody.username || typeof parsedBody.age !== "number" || !Array.isArray(parsedBody.hobbies)) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Missing required fields: username, age, hobbies" }));
        return;
      }
  
      const newObject = { ...parsedBody, id: uuidv4() };
     users.push(newObject);
      res.end(JSON.stringify({ message: "User was added", object: newObject }));
    });
  } 
  else if (req.method === "PUT" && parsedUrl.pathname?.startsWith("/users/")) {
    const id = parsedUrl.pathname.split("/")[2];
    let body = "";
    req.on("data", (chunk: string) => (body += chunk));
    req.on("end", () => {
      const index = users.findIndex((user) => user.id === id);
      if (index === -1) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "User is not found" }));
        return;
      }
      
      const updatedObject = { ...users[index], ...JSON.parse(body) }; 
      users[index] = updatedObject;
      res.end(JSON.stringify({ message: "User was updated", object: updatedObject }));
    });
  } 
  else if (req.method === "DELETE" && parsedUrl.pathname?.startsWith("/objects/")) {
    const id = parsedUrl.pathname.split("/")[2];
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "User is not found" }));
      return;
    }

   users.splice(index, 1);
    res.end(JSON.stringify({ message: "User was removed" }));
  } 
  else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Page is not found" }));
  }
};
