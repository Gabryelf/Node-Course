const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const NAME_PROJ = '"NOTE"-"BOOK"';

let notes = [];

let str = `Тебя приветствует приложение ${NAME_PROJ}`;

const addNote = () => {
  rl.question("Введите заголовок", (title) => {
    rl.qustion("Напишите текст заметки", (content) => {
      const newNote = {
        id: notes.length + 1,
        title: title,
        content: content,
        date: new Date().toLocaleString()
      };
    });
  });
}; 

