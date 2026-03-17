//=============================
// Осеовной скрипт приложения
//=============================

// импорты
const readline = require("readline"); // импортируем модуль из node
const helper = require("./utils/helper"); // импортируем свои модули 
const Decorator = require("./utils/decorator");
// инициализация ввода вывода
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
// переменные
const NAME_PROJ = '"NOTE"-"BOOK"';

let notes = [];

let welcome = `Тебя приветствует приложение ${NAME_PROJ}`;

//=============================
// Функции
//=============================

//приветствие
const welcomeApp = () => {
  Decorator.presentMenu(welcome);
  showMenu();
};
//добавление заметки
const addNote = () => {
  rl.question("Введите заголовок  ", (title) => {
    rl.question("Напишите текст заметки  ", (content) => {
      const newNote = {
        id: notes.length + 1,
        title: title,
        content: content,
        date: new Date().toLocaleString()
      };
      notes.push(newNote);
      console.log(`Заметка ${newNote.title} сохранена!`);
      helper.statsNotes(notes);

      showMenu();
    });
  });
}; 
//просмотр всех заметок
const showNotes = () => {
  console.log("----Все ваши заметки----");
  notes.forEach((note) => {
    console.log("-".repeat(30));
    console.log(`${note.id} * ${note.date}`);
    console.log(`${note.title}`);
    console.log(`${note.content}`);
    console.log("-".repeat(30));
  });
  showMenu();
};
//меню программы
const showMenu = () => {
  helper.statsNotes(notes);
  console.log("Главное меню");
  console.log("1. Добавить заметку");
  console.log("2. Посмотреть заметки");
  console.log("3. Удаление заметки");
  console.log("4. Выход");

  rl.question("Выберите пункт от 1 до 4  ", (choice) => {
    switch(choice){
      case '1':
        addNote();
        break;
      case '2':
        showNotes();
        break;
      case '3':
        deleteNote();
        break;
      case '4':
        console.log("Завершение работы!")
        rl.close();
        break;
      default:
        console.log("Нет такого пункта!");
        showMenu();
    };
  });
};
//удаление заметки
const deleteNote = () => {
  if(notes.length === 0){
    console.log("У вас пока нет заметок!");
  }
  notes.forEach((note) => {
    console.log(`\n * [${note.id}] * ${note.title} *`);
  });
  rl.question("Введите номер заметки для удаления или 0 для отмены  ", (choice) =>{
    let num = parseInt(choice);
    if(num === 0){
      showMenu();
    }
    else if(num > 0 && num <= notes.length){
      notes.splice(num - 1, 1);
      notes = helper.reindexId(notes);
      console.log(`Заметка удалена!`);
    }
    else{
      console.log("Нет подходящей заметки!");
      showMenu();
    }
     showMenu();
  });
  showMenu();
};
//запуск программы
welcomeApp();
