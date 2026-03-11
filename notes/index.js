const readline = require("readline"); // импортируем модуль из node

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
      notes.push(newNote);
      console.log(`Заметка ${newNote.title} сохранена!`);
      console.log(`Всего заметок ${notes.length}`);
    });
  });
}; 

const showMenu = () => {
  console.log(`${str}`);
  console.log(`Всего заметок ${notes.length}`);
  console.log("Введите номер действия от 1 до 4");
  console.log("1. Доюавить заметку");

  addNotes();
};

