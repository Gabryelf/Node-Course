const btnAction = document.getElementById("btnAction")
btnAction.addEventListener("click", () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const tab = tabs[0];
        if(tab){
            chrome.scripting.executeScript(
                {
                    target: {tabId: tab.id, allFrames: true},
                    func: grabImages

                },
                onResult
            )
        }
        else{
            alert("No tabs active!");
        }
    });
});

function grabImages(){
    // ищем все url адреса - img links href
    const images = document.querySelectorAll("img");
    return Array.from(images).map(image => image.src);
}

function onResult(frames){
    // объединяем в массивы адреса
    const imageUrls = frames.map(frame => frame.result)
    .reduce((r1, r2) => r1.concat(r2));
    // сохранить в буфер обмена
    window.navigator.clipboard.writeText(imageUrls.join("\n"))
    .then(() => {
        window.close();
    });
}

