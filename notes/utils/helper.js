// скрипт помошник с дополнительными функциями для index.js
const reindexId = (notes) => {
  return notes.map((notes, index) => ({...notes, id:index + 1}));
};

const statsNotes = (notes) => {
  console.log(`Всего заметок ${notes.length}`);
};

module.exports = {reindexId, statsNotes};
