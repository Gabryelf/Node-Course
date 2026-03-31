// list quotes
let quotes = [];

// save quotes
function saveQuotes(){
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// load quotes
function loadQuotes(){
  const saved = localStorage.getItem('quotes');
  if(saved){
    quotes = JSON.parse(saved);
  }
}
// add quote
function addQuote(){
  // get elements
  const text = document.getElementById('quoteText');
  const author = document.getElementById('quoteAuthor');
  // input get data
  const textInput = text.value;
  const authorInput = author.value;
  // save data
  quotes.push({textInput, authorInput});
  saveQuotes(quotes);
}

// show quotes
function renderQuotes(){
  // get elements
  let list = document.getElementById("quotesList");
  let html = "";
  quotes.forEach((quote, index) => {
    html += `
      <div class=""> ${quote.textInput}</div>
      <div class=""> ${quote.authorInput}</div>
      <button class="delete-btn" data-index="${index}"> Удалить </button>
      `;
  });
  list.innerHTML = html;

  // render cards
  document.querySelectorAll("delete-btn").forEach(btn => { btn.addEventListener('click', (e) => {})});

  // add event delete
}

// events
document.getElementById('addBtn').addEventListener('click', addQuote);

// start app
loadQuotes();
