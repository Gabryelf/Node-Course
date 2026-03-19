const stats = document.getElemettById('stats');
const content = document.getElemettById('content');

let notes = []

async function loadNotes(){
  try{
    const res = await fetch('/api/notes/');
    notes = await res.json();
    stats.innerText = `Заметок ${notes.length}`
  }
  catch(error){
    console.log("Ощибка", error);
    stats.innerText = `Информации о заметках нет`
  }
}
