const fs = require("fs");
const path = require("path");
const fsPropmise = require("fs/promises");
const dotenv = require("dotenv");
dotenv.config();

const errorCallback = (err) => {
  if (err) throw err;
};

// Создание папок
fs.mkdirSync(path.resolve(__dirname, "dir")); // Создаётся папка по указанному пути
fs.mkdirSync(path.resolve(__dirname, "dir1", "dir2", "dir3"), {
  recursive: true,
}); // Рекурсивное создание папок

fs.mkdir(path.resolve(__dirname, "dirA"), errorCallback);

// Удаление папок
function deleteFolder(p) {
  // Рекурсивно удаляет папку со всеми вложенными файлами и папками
  let files = [];
  if (fs.existsSync(p)) {
    files = fs.readdirSync(p);
    files.forEach((file) => {
      const curPath = p + "/" + file;
      if (fs.statSync(curPath).isDirectory()) deleteFolder(curPath);
      else fs.rm(curPath);
    });
    fs.rmdirSync(p);
  }
}

fs.rmdir(path.resolve(__dirname, "dir"), errorCallback);
fs.rmdir(path.resolve(path.resolve(__dirname, "dirA")), errorCallback);
deleteFolder(path.join(__dirname, "dir1"));

// Создание файла и его удаление
const testPath = path.resolve(__dirname, "test.txt");
fs.writeFileSync(testPath, "Hello World", errorCallback);
fs.appendFileSync(testPath, " Добавили в конец", errorCallback);
fs.rmSync(testPath);

// Промиссификация функции
const writeFileAsync = async (path, data) => {
  return new Promise((resolve, reject) =>
    fs.writeFile(path, data, (err) => {
      if (err) return reject(err);
      resolve();
    })
  );
};

const func = async (path) => {
  try {
    await writeFileAsync(path, "Hello World");
    await fsPropmise.appendFile(path, " В конец файла");
    const text = await fsPropmise.readFile(path, { encoding: "utf-8" }); // Чтение
    console.log(text);
    await fsPropmise.rm(path);

    const text2 = process.env.TEXT;
    await writeFileAsync(path, text2);
    const textFile = await fsPropmise.readFile(testPath);
    console.log(textFile.length);
    await fsPropmise.rm(path);
  } catch (err) {
    console.log(err);
  }
};

func(testPath);
