const loadBtn = document.getElementById("load-btn")
  .addEventListener("click", () => {
    chrome.tabs.query({active: true}, (tabs) => {
      const tab = tabs[0];
      if(tab){
        alert(tab.id);
      }
      else
      {
        console.log("No active tab");
      }
    });
  });
