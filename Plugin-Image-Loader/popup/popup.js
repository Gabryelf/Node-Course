const loadBtn = document.getElementById("load-btn")
  .addEventListener("click", () => {
    chrome.tabs.query({active: true}, (tabs) => {
      const tab = tabs[0];
      if(tab){
        chrome.scripting.executeScript({
          target: {tabID: tab.id}, 
          func: selectImages
        },
        onResult
        );
      }
    });
  });

function selectImages(){
  const imagesUrl = document.querySelectorAll("img");
  return Array.;
}

function onResult(){
  
}
