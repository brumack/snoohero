let lastArticleSeen = null
let lastLoadTime = null

chrome.runtime.onMessage.addListener(message => {
    if (message.topic === 'updateArticle') {
        lastArticleSeen = message.article
        lastLoad = Date.now()
    } else if (message.topic === 'reset') {
        lastArticleSeen = null
        lastLoad = null
    } else if (message.topic === 'getLastLoad') {
        messageTabs({topic: 'lastLoad', lastLoadTime, lastArticleSeen })
    } else if (message.topic === 'setLastLoad') {
        lastArticleSeen = message.lastArticleSeen
        lastLoad = Date.now()
    }
})

function messageTabs(message) {
    chrome.tabs.query({url: "https://www.reddit.com/"}, tabs => {
        if (tabs && tabs.length > 0) tabs.forEach(tab => chrome.tabs.sendMessage(tab.id, message))
    });
}