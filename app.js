(() => {

    let lastLoadTime = null;
    let lastArticleSeen = null;

    if (document.URL === 'https://www.reddit.com/') {
        console.log('running extension')
        
        chrome.runtime.onMessage.addListener(message => {
            console.log('message', message)
            if (message.topic === 'lastLoad') {
                lastLoadTime = message.lastLoadTime
                lastArticleSeen = message.lastArticleSeen
                console.log('last load time', lastLoadTime)
                console.log('last article seen', lastArticleSeen)
                if (lastArticleSeen && lastLoadTime && Date.now() - lastLoadTime < 30 * 1000) {
                    console.log('scrolling...')
                    scrollToArticle(lastArticleSeen)
                } else {
                    // leave page at top, start scroll monitoring
                    console.log('recording actions...')
                    window.addEventListener('scroll', getTopArticle)
                }
            }
        })
        chrome.runtime.sendMessage({ topic: 'getLastLoad' })
    }
    
    function getTopArticle() {
        chrome.runtime.sendMessage({ topic: 'setLastLoad' })
        const articles = Array.from(document.querySelectorAll('[data-click-id="body"]'))
        let topArticle = null 
    
        for (let i = 0; i < articles.length; i++) {
            const articleBounding = articles[i].getBoundingClientRect();
            if (articleBounding.top >= 0) {
                topArticle = articles[i]
                console.log('Top Article:', topArticle)
                break;
            }
        }
    
        chrome.runtime.sendMessage({ topic: 'updateArticle', article: topArticle })
    }

    function scrollToArticle(article) {
        const articles = Array.from(document.querySelectorAll('[data-click-id="body"]'))
        const articleIndex = articles.indexOf(article)
        if (articleIndex !== -1) {
            const articleBounding = article.getBoundingClientRect();
            window.scrollTo(0, articleBounding.height);
            window.addEventListener('scroll', getTopArticle)
        } else {
            window.scrollTo(0,document.body.scrollHeight);
            scrollToArticle(article)
        }
    }
})()