// Like Button Code

let updateLikesTitle = function(likesValue, btn) {
    let likeTitleSpan = btn.parentElement.querySelector("#like-title")
    if (likesValue <= 0) {
        likeTitleSpan.classList.add("likes-hidden")
    } else if (likesValue == 1) {
        if (likeTitleSpan.classList.contains("likes-hidden")) {
            likeTitleSpan.classList.remove("likes-hidden")
        }
        likeTitleSpan.innerHTML = " Like"
    } else {
        likeTitleSpan.innerHTML = " Likes"
    }
}

let updateLikesCount = function(action, btn) {
    let likesCounter = btn.parentElement.querySelector(".likes-count")
    let likesValue = parseInt(likesCounter.innerHTML)
    if (action == "add") {
        if (likesValue == 0) {
            likesCounter.classList.remove("likes-hidden")
        }
        likesValue += 1
        likesCounter.innerHTML = likesValue
        updateLikesTitle(likesValue, btn)
    } else {
        likesValue -= 1
        likesCounter.innerHTML = likesValue
        if (likesValue == 0) {
            likesCounter.classList.add("likes-hidden")
        }
        updateLikesTitle(likesValue, btn)
    }
}

let likeBtnAction = function(btn) {
    let id = btn.getAttribute("data-id")
    fetch(`/post-like/${id}/`)
    .then(response => response.text())
    .then(text => {
        if (text == "Added Like") {
            btn.classList.add("liked")
            btn.innerHTML = `<i class="fa fa-heart" aria-hidden="true"></i>Liked Post`
            updateLikesCount("add", btn)
        } else {
            btn.classList.remove("liked")
            btn.innerHTML = `<i class="fa fa-heart" aria-hidden="true"></i>Like Post`
            updateLikesCount("subtract", btn)
        }
    }).catch(function() {
        console.log("There was an error.")
    })
}

//  You need to add some sort of watcher so everytime that new posts are added to the page, you add on this event listener to them.
if (document.querySelector(".like-btn")) {
    let likeBtns = document.querySelectorAll(".like-btn")
    likeBtns.forEach(btn => btn.addEventListener("click", (event) => {
        event.preventDefault()
        likeBtnAction(btn)
}))
}

// End of Like Button Code
