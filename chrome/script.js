//wow such code

//Listen for scroll event to minimize impact of the indicator
window.addEventListener('scroll', makeUnobtrusive, false);

//create a var to hold DOM element for indicator
//so global very bad
var dogeIndicator;

if (!document.getElementById('dogetip_check')) {
    dogeIndicator = document.createElement('div');
    dogeIndicator.setAttribute('id', 'dogetip_check');
    //wow such style
    dogeIndicator.style.position = 'fixed';
    dogeIndicator.style.right = '100px';
    dogeIndicator.style.top = '50px';
    dogeIndicator.style.width = '250px';
    dogeIndicator.style.height = 'auto';
    dogeIndicator.style.backgroundColor = '#595858';
    dogeIndicator.style.borderRadius = '5px';
    dogeIndicator.style.padding = '5px 2px 5px 5px';
    dogeIndicator.style.color = "#eaeaea";
    dogeIndicator.style.zIndex = 9001;
} else {
    dogeIndicator = document.getElementById('dogetip_check');
}

//parse current URL and pull subreddit name
function getCurrentSubreddit() {
    var bIndex,
    eIndex,
    url = window.location.href,
        subName;
    bIndex = url.indexOf('/r/') + 3;
    eIndex = url.indexOf('/', bIndex);

    subName = (eIndex == -1 ? url.slice(bIndex) : url.slice(bIndex, eIndex));
    console.log(subName);

    return subName;
}

//logic to populate indicator
function canTip(subreddit) {
    //such JSON
    var subredditList = JSON.parse(dogetipList),
        tippingStatus = 'Tipping on this subreddit is <b>';

    if (subredditList[subreddit] || subreddit == 'dogecoin') {
        tippingStatus = tippingStatus + 'ALLOWED.</b>';
        dogeIndicator.style.border = '3px solid #23b223';
    } else if (subredditList[subreddit] === false) {
        tippingStatus = tippingStatus + 'BANNED.</b>';
        dogeIndicator.style.border = '3px solid #f40000';
    } else if (subredditList[subreddit] == undefined || subredditList[subreddit] == null) {
        tippingStatus = tippingStatus + 'THE WILD WEST.</b></br></br> This subreddit has not explicitly stated whether' + ' tipping is okay so please be a respectable shibe and use good judgment!';
        dogeIndicator.style.border = '3px solid #ffba54';
    }

    dogeIndicator.innerHTML = tippingStatus;
    //check if indicator doesn't exist(probably doesn't ever, but better safe than sorry)
    if (!document.getElementById('dogetip_check')) {
        document.body.appendChild(dogeIndicator);
    }
}

//style indicator to make it less obtrusive once scrolling begins
function makeUnobtrusive() {
    //wow such arbitrary
    if (unsafeWindow.pageYOffset > 100) {
        dogeIndicator.style.top = '0px';
        dogeIndicator.style.maxHeight = '20px';
        dogeIndicator.style.overflowY = 'hidden';
        dogeIndicator.style.borderTopLeftRadius = '0px';
        dogeIndicator.style.borderTopRightRadius = '0px';
    } else {
        dogeIndicator.style.top = '50px';
        dogeIndicator.style.height = 'auto';
        dogeIndicator.style.maxHeight = 'none';
        dogeIndicator.style.overflowY = 'visible';
        dogeIndicator.style.borderTopLeftRadius = '5px';
        dogeIndicator.style.borderTopRightRadius = '5px';
    }
}

//so execute
//If the subreddit list isn't already in storage make a request to get it
xhr = new XMLHttpRequest();
xhr.open("GET", "http://www.reddit.com/r/dogecoin/wiki/other_subreddit_tipping", true);
xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
        var responseHTML = null;
        if (xhr.responseText) {
            responseHTML = new DOMParser()
                .parseFromString(xhr.responseText, "text/html");
            //such xpath wow very select
            var subreddits = document.evaluate("//table[//thead//th[contains(.,'Subreddit')]]/tbody/tr/td[1]/a",
            responseHTML, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null),
                subreddit_allowed = document.evaluate("//table[//thead//th[contains(.,'Subreddit')]]/tbody/tr/td[2]",
                responseHTML, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
            var tempSubList = {};
            //iterate through each collection of cells in the DOM table and get subreddit name & tipping permissions
            for (var i = 0; i < subreddits.snapshotLength; i++) {
                var sRawName = subreddits.snapshotItem(i).innerText;
                var sname = sRawName.slice(sRawName.lastIndexOf("/") + 1);
                //convert "Yes" and "No" to true/false
                //such bool
                tempSubList[sname] = (subreddit_allowed.snapshotItem(i).innerText == "Yes");
            }
            //so JSON
            dogetipList = JSON.stringify(tempSubList);
            canTip(getCurrentSubreddit(), dogetipList); 
        }
    }
}
xhr.send();