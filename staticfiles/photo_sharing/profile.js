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

// Start of Read More Button

let revealFullDescription = function(btn) {
  postDescriptionSpan = btn.parentElement.querySelector(".post-text")
  postDescriptionSpan.innerHTML = postDescriptionSpan.getAttribute("data-description")
  btn.remove()
}

let readMoreBtns = document.querySelectorAll(".post-read-more-btn")
readMoreBtns.forEach(btn => btn.addEventListener("click", () => {
  revealFullDescription(btn)
}))

// End of Read More Button


// Asynchronous Modal Post Load
let modal_container = document.querySelector(".custom_modal__container")

let showPost = function(post) {
  let firstDiv = document.createElement("div")
  firstDiv.className = 'row no-gutters justify-content-center home'

  let secondDiv = document.createElement("div")
  secondDiv.className = "col-12 post-block"
  
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

  let postDescriptionSpan = document.createElement("span")
  let capitalizedDescription = post.description.charAt(0).toUpperCase() + post.description.slice(1)
  postDescriptionSpan.setAttribute("data-description", capitalizedDescription)
  postDescriptionSpan.className = "post-text"

  let readMoreBtn = document.createElement("button")
  readMoreBtn.className = "post-read-more-btn"
  readMoreBtn.innerHTML = "Read More"

  if (post.description.length > 90) {
    postDescriptionSpan.innerHTML = capitalizedDescription.substring(0, 90) + "..."
  } else {
    postDescriptionSpan.innerHTML = capitalizedDescription
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
  postDescription.insertAdjacentElement("beforeend", postDescriptionSpan)
  if (post.description.length > 90) {postDescription.insertAdjacentElement("beforeend", readMoreBtn)}
  sixthDiv.insertAdjacentElement("beforeend", postLikeLink)
  sixthDiv.insertAdjacentElement("beforeend", postDate)

  document.querySelector(".next-btn").setAttribute("data-id", `${post.id}`)
  document.querySelector(".previous-btn").setAttribute("data-id", `${post.id}`)

  modal_container.replaceChild(firstDiv, modal_container.childNodes[0]);

  postLikeLink.addEventListener("click", () => {
    event.preventDefault()
    likeBtnAction(postLikeLink)
  })

  readMoreBtn.addEventListener("click", () => {
    revealFullDescription(readMoreBtn)
  })
}


// Modal Section 

let displayPost = function(post) {
  fetch(`/get-post-details/${post.getAttribute("data-id")}/`)
  .then(response => response.json())
  .then(data => {
    showPost(data)
    custom_modal.classList.add("custom_modal--visible")
    disableBtnCheck(post)
    // Just a note: change the classes in your fetch function, such as the post-block, and make it a new css class that has desired properties (height, width, etc.)
  }).catch(() => {
    console.log("There was an error fetching the post data.")
  })
}

let viewPostBtns = document.querySelectorAll(".view-post-btn")
let custom_modal = document.querySelector(".custom_modal")
let exitBtn = document.querySelector(".custom_modal__exit-btn")
let nextBtn = document.querySelector(".next-btn")
let previousBtn = document.querySelector(".previous-btn")

let disableBtnCheck = function(post) {
  if (!post.nextElementSibling) {
    nextBtn.disabled = true
  } else {
    nextBtn.disabled = false
  }
  
  if (!post.previousElementSibling) {
    previousBtn.disabled = true
  } else {
    previousBtn.disabled = false
  }
}

viewPostBtns.forEach(btn => btn.addEventListener("click", () => {
  let post = btn.parentElement.parentElement.parentElement.parentElement
  displayPost(post)
}))

exitBtn.addEventListener("click", () => {
  custom_modal.classList.remove("custom_modal--visible")
})

custom_modal.addEventListener("click", (event) => {
  if (event.target.classList.contains("custom_modal")) {
    custom_modal.classList.remove("custom_modal--visible")
  }
})

nextBtn.addEventListener("click", () => {
  let id = nextBtn.getAttribute("data-id")
  let element = document.querySelector(`[data-id="${id}"]`)
  let nextElement = element.nextElementSibling
  displayPost(nextElement)
})

previousBtn.addEventListener("click", () => {
  let id = previousBtn.getAttribute("data-id")
  let element = document.querySelector(`[data-id="${id}"]`)
  let previousElement = element.previousElementSibling
  if (previousElement) {
    displayPost(previousElement)
  }
})

document.addEventListener("keyup", (event) => {
  if (event.keyCode == 27 && custom_modal.classList.contains("custom_modal--visible")) {
    custom_modal.classList.remove("custom_modal--visible")
  }
})

/* End of Modal Section */



/* Start of Profile Page Button Code */

let deleteBtns = document.querySelectorAll(".delete-post-btn")
let editBtns = document.querySelectorAll(".edit-post-btn")
let modifyPostBtn = document.querySelector(".modify-post-btn")

// Adds edit & delete buttons to each post
modifyPostBtn.addEventListener("click", () => {
  if (!document.querySelector(".btn-visible")) {
    deleteBtns.forEach(btn => btn.classList.add("btn-visible"))
    editBtns.forEach(btn => btn.classList.add("btn-visible"))
  } else {
    deleteBtns.forEach(btn => btn.classList.remove("btn-visible"))
    editBtns.forEach(btn => btn.classList.remove("btn-visible"))
  }
})

// Fetch POST Function:
function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
          var cookie = jQuery.trim(cookies[i]);
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}
// End of Fetch POST Function

// Delete Btn Action
deleteBtns.forEach(btn => btn.addEventListener("click", () => {
  let id = btn.getAttribute("data-id")
  if (confirm("Are you sure you want to delete this post?")) {
    fetch(`/delete-post/${id}/`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
        "Accept": "application/json",
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.text())
    .then(text => {
      if (text == "post deleted") {
        let currentPost = btn.parentElement.parentElement
        // Removes the post from frontend
        currentPost.classList.add("fade-away-animation")
        currentPost.addEventListener("animationend", () => {
          btn.parentElement.parentElement.remove()
          // Checks to see if the user has any posts
          if (!document.querySelector(".post-block")) {
            // Adds in empty post div
            document.querySelector(".row").innerHTML = `<div class='empty-profile-posts'>You do not have any posts.</div>`
          }
        })
      }
    }).catch(() => {
      console.log("There was an error deleting the post")
    })
  }
}))

// Edit Btn Action
editBtns.forEach(btn => btn.addEventListener("click", () => {
  let id = btn.getAttribute("data-id")
  let description = btn.getAttribute("data-description")
  let result = prompt("Edit your post", description)
  if (result) {
    console.log(result)
    fetch(`/update-post/${id}/`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
        "Accept": "application/json",
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({description: result})
    })
    .then(response => response.text())
    .then(text => {
      if (text == "post updated") {
        // Adds new description to data-description, so it will get grabbed if edit is clicked again
        btn.setAttribute("data-description", result)
        // Adds capital letter to beginning of description
        result = result.charAt(0).toUpperCase() + result.slice(1)
        let descriptionSpan = btn.parentElement.parentElement.querySelector(".post-text")
        // Deals with formatting the post description
        if (result.length > 70) {
          descriptionSpan.innerHTML = result.substring(0, 69) + "..."
        } else if (result.length < 35) {
          descriptionSpan.innerHTML = result + "<br>"
        } else {
          descriptionSpan.innerHTML = result
        }
      }
    }).catch(() => {
      console.log("There was an error updating the post")
    })
  }
}))
