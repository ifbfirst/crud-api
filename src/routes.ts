import url from "url";
import { objects } from "./db";
import { v4 as uuidv4 } from "uuid";

export const handleRequest = (req: any, res: any) => {
  const parsedUrl = url.parse(req.url!, true);
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET") {
    if (parsedUrl.pathname === "/objects") {
      res.end(JSON.stringify(objects));
    } else if (parsedUrl.pathname?.startsWith("/objects/")) {
      const id = parsedUrl.pathname.split("/")[2];
      const object = objects.find((obj) => obj.id === id);
      
      if (!object) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Object is not found" }));
        return; 
      }
      res.end(JSON.stringify(object));
    }
  } 
  else if (req.method === "POST" && parsedUrl.pathname === "/objects") {
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
      objects.push(newObject);
      res.end(JSON.stringify({ message: "Object was added", object: newObject }));
    });
  } 
  else if (req.method === "PUT" && parsedUrl.pathname?.startsWith("/objects/")) {
    const id = parsedUrl.pathname.split("/")[2];
    let body = "";
    req.on("data", (chunk: string) => (body += chunk));
    req.on("end", () => {
      const index = objects.findIndex((obj) => obj.id === id);
      if (index === -1) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Object is not found" }));
        return;
      }
      
      const updatedObject = { ...objects[index], ...JSON.parse(body) }; 
      objects[index] = updatedObject;
      res.end(JSON.stringify({ message: "Object was updated", object: updatedObject }));
    });
  } 
  else if (req.method === "DELETE" && parsedUrl.pathname?.startsWith("/objects/")) {
    const id = parsedUrl.pathname.split("/")[2];
    const index = objects.findIndex((obj) => obj.id === id);
    if (index === -1) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Object is not found" }));
      return;
    }

    objects.splice(index, 1);
    res.end(JSON.stringify({ message: "Object was removed" }));
  } 
  else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Page is not found" }));
  }
};
