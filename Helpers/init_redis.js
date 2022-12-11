import redis from "redis";

const radisClient = redis.createClient({
  port: 6379,
  host: "127.0.0.1",
});

radisClient.connect();

radisClient.on("connect", () => {
  console.log("Client connected to radis");
});

radisClient.on("ready", () => {
  console.log("Client connected to radis and ready to use");
});

radisClient.on("error", (err) => {
  console.log(err.message);
});

radisClient.on("end", () => {
  console.log("Client disconnected from redis");
});

process.on("SIGINT", () => {
  radisClient.quit();
});

export default radisClient;
