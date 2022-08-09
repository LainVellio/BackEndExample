// Удобно использовать в http, websockets, long pulling, clusters

const Emitter = require("events");
const dotenv = require("dotenv");
dotenv.config();

const emitter = new Emitter();

const callback = (data, second) => {
  console.log("Вы прислали сообщение " + data);
  console.log("Второй аргумент " + second);
};

emitter.on("message", callback);

const MESSAGE = process.env.message || "";

if (MESSAGE) {
  emitter.emit("message", MESSAGE, 123);
} else {
  emitter.emit("message", "Вы не указали сообщение");
}

emitter.removeListener("message", callback);
