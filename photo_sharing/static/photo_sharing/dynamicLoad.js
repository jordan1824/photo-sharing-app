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

if (document.querySelector(".like-btn")) {
  let likeBtns = document.querySelectorAll(".like-btn")
  likeBtns.forEach(btn => btn.addEventListener("click", (event) => {
      event.preventDefault()
      likeBtnAction(btn)
}))
}

// End of Like Button Code


// Asynchronous Post Load

let postContainer = document.querySelector("#global-posts")

let createPost = function(post) {
  let firstDiv = document.createElement("div")
  firstDiv.className = 'row no-gutters justify-content-center home'

  let secondDiv = document.createElement("div")
  secondDiv.className = "col-9 post-block"
  
  let thirdDiv = document.createElement("div")
  thirdDiv.className = "post-image"
  
  let postImage = document.createElement("img")
  postImage.setAttribute("src", `/media/${post.image}`)
  postImage.setAttribute("alt", `Post Image`)

  let fourthDiv = document.createElement("div")
  fourthDiv.className = "post-description-section"

  let fifthDiv = document.createElement("div")
  fifthDiv.className = "post-user-image"

  let userImage = document.createElement("img")
  userImage.setAttribute("src", `/media/${post.authorProfileImage}`)
  userImage.setAttribute("alt", `User Profile Image`)

  let sixthDiv = document.createElement("div")
  sixthDiv.className = "post-description"

  let usernameLink = document.createElement("a")
  usernameLink.className = "username-link"
  usernameLink.setAttribute("href", `/user/profile/${post.author}/`)

  let username = document.createElement("h6")
  username.innerHTML = post.author.charAt(0).toUpperCase() + post.author.slice(1)

  let seventhDiv = document.createElement("div")
  seventhDiv.className = "likes"

  let likesLink = document.createElement("a")
  likesLink.setAttribute("href", `/post-likes/${post.id}/`)

  let pTag = document.createElement("p")

  let likeCountSpan = document.createElement("span")
  if (post.postLikesCount > 0) {
    likeCountSpan.className = "likes-count"
    likeCountSpan.innerHTML = `${post.postLikesCount}`
  } else {
    likeCountSpan.className = "likes-count likes-hidden"
    likeCountSpan.innerHTML = "0"
  }

  let likeTitleSpan = document.createElement("span")
  likeTitleSpan.setAttribute("id", "like-title")
  if (post.postLikesCount == 1) {
    likeTitleSpan.innerHTML = " Like"
  } else if (post.postLikesCount > 1) {
    likeTitleSpan.innerHTML = " Likes"
  } else {
    likeTitleSpan.className = "likes-hidden"
    likeTitleSpan.innerHTML = " Like"
  }

  let postDescription = document.createElement("p")
  postDescription.className = "post-p"
  let capitalizedDescription = post.description.charAt(0).toUpperCase() + post.description.slice(1)
  if (post.description.length > 90) {
    postDescription.innerHTML = capitalizedDescription.substring(0, 90) + "..."
  } else {
    postDescription.innerHTML = capitalizedDescription
  }

  let postLikeLink = document.createElement("a")
  postLikeLink.setAttribute("href", `/post-like/${post.id}/`)
  postLikeLink.setAttribute("data-id", `${post.id}`)
  if (post.isLiked) {
    postLikeLink.className = "like-btn liked"
    postLikeLink.innerHTML = `<p><i class="fa fa-heart" aria-hidden="true"></i>Liked Post</p>`
  } else {
    postLikeLink.className = "like-btn"
    postLikeLink.innerHTML = `<p><i class="fa fa-heart" aria-hidden="true"></i>Like Post</p>`
  }

  let postDate = document.createElement("p")
  postDate.className = "post-date"
  postDate.innerHTML = post.date_created


  firstDiv.insertAdjacentElement("beforeend", secondDiv)
  secondDiv.insertAdjacentElement("beforeend", thirdDiv)
  thirdDiv.insertAdjacentElement("beforeend", postImage)
  secondDiv.insertAdjacentElement("beforeend", fourthDiv)
  fourthDiv.insertAdjacentElement("beforeend", fifthDiv)
  fifthDiv.insertAdjacentElement("beforeend", userImage)
  fourthDiv.insertAdjacentElement("beforeend", sixthDiv)
  sixthDiv.insertAdjacentElement("beforeend", usernameLink)
  usernameLink.insertAdjacentElement("beforeend", username)
  sixthDiv.insertAdjacentElement("beforeend", seventhDiv)
  seventhDiv.insertAdjacentElement("beforeend", likesLink)
  likesLink.insertAdjacentElement("beforeend", pTag)
  pTag.insertAdjacentElement("beforeend", likeCountSpan)
  pTag.insertAdjacentElement("beforeend", likeTitleSpan)
  sixthDiv.insertAdjacentElement("beforeend", postDescription)
  sixthDiv.insertAdjacentElement("beforeend", postLikeLink)
  sixthDiv.insertAdjacentElement("beforeend", postDate)

  postContainer.insertAdjacentElement("beforeend", firstDiv)

  return postLikeLink
}


// Get rid of this later. This automatically loads in all the posts at once
// You will want to limit this to only 10 or 20 later on, instead of all
// fetch("/dynamic-load/")
//   .then(response => response.json())
//   .then(data => {
//     data.forEach(post => {
//       let likeBtn = createPost(post)
//       likeBtn.addEventListener("click", (event) => {
//         event.preventDefault()
//         likeBtnAction(likeBtn)
//       })
//     })
//   }).catch(() => {
//     console.log("There was an error running the fetch.")
//   })




window.addEventListener("scroll", (event) => {
  if (window.scrollY + window.innerHeight >= document.body.offsetHeight) {
    fetch("/dynamic-load/")
    .then(response => response.json())
    .then(data => {
      data.forEach(post => {
        let likeBtn = createPost(post)
        likeBtn.addEventListener("click", (event) => {
          event.preventDefault()
          likeBtnAction(likeBtn)
        })
      })
    }).catch(() => {
      console.log("There was an error running the fetch.")
    })
  }
})


// End of Asynchronous Post Load
