
/* ==== Start of Like Button Code ==== */

// Adds event listener to like buttons already loaded on the page
if (document.querySelector(".like-btn")) {
  let likeBtns = document.querySelectorAll(".like-btn")
  likeBtns.forEach(btn => btn.addEventListener("click", (event) => {
      event.preventDefault()
      likeBtnAction(btn)
}))
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

/* ==== End of Like Button Code ==== */



/* ==== Start of Read More Button ==== */

// Adds event listener to read more buttons already loaded on the page
if (document.querySelector(".post-read-more-btn")) {
  let readMoreBtns = document.querySelectorAll(".post-read-more-btn")
  readMoreBtns.forEach(btn => btn.addEventListener("click", () => {
    revealFullDescription(btn)
  }))
}

let revealFullDescription = function(btn) {
  postDescriptionSpan = btn.parentElement.querySelector(".post-text")
  postDescriptionSpan.innerHTML = postDescriptionSpan.getAttribute("data-description")
  btn.remove()
}

/* ==== End of Read More Button Code ==== */



/* ==== Start of Modal / Post Popup Code ==== */

// Displays modal / post popup
let displayPost = function(post) {
  fetch(`/get-post-details/${post.getAttribute("data-id")}/`)
  .then(response => response.json())
  .then(data => {
    // Adds new post to the modal
    showPost(data)
    // Makes modal visible
    custom_modal.classList.add("custom_modal--visible")
    // Disables buttons if needed (if post is first or last)
    disableBtnCheck(post)
    // Just a note: change the classes in your fetch function, such as the post-block, and make it a new css class that has desired properties (height, width, etc.)
  }).catch(() => {
    console.log("There was an error fetching the post data.")
  })
}

// Creates post element, and adds event listeners to post buttons
let modal_container = document.querySelector(".custom_modal__container")
let showPost = function(post) {

  /* Start of post element creation */

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

  /* End of post element creation */

  // Updates next & previous button data so the buttons will work properly
  document.querySelector(".next-btn").setAttribute("data-id", `${post.id}`)
  document.querySelector(".previous-btn").setAttribute("data-id", `${post.id}`)

  // Replaces previous post with the new post that was just created
  modal_container.replaceChild(firstDiv, modal_container.childNodes[0]);

  // Adds on event listeners to buttons
  postLikeLink.addEventListener("click", () => {
    event.preventDefault()
    likeBtnAction(postLikeLink)
  })
  readMoreBtn.addEventListener("click", () => {
    revealFullDescription(readMoreBtn)
  })
}

// Disables next & previous buttons when needed
let disableBtnCheck
// Global Feed Page:
if (document.querySelector(".global-feed")) {
  disableBtnCheck = function(post) {
    if (post.getAttribute("data-id") == 1) {
      nextBtn.disabled = true
    } else {
      nextBtn.disabled = false
    }

    if (!post.parentElement.previousElementSibling) {
      previousBtn.disabled = true
    } else {
      previousBtn.disabled = false
    }
  }
}
// Profile Page:
if (document.querySelector(".profile-block")) {
  disableBtnCheck = function(post) {
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
}

// General configuration for modal
let custom_modal = document.querySelector(".custom_modal")
let exitBtn = document.querySelector(".custom_modal__exit-btn")
// NextBtn & PreviousBtn config can be found in the related page below
let nextBtn = document.querySelector(".next-btn")
let previousBtn = document.querySelector(".previous-btn")
// Exit button configuration
exitBtn.addEventListener("click", () => {
  custom_modal.classList.remove("custom_modal--visible")
})
// Closes modal when anywhere but post is clicked (while modal is open)
custom_modal.addEventListener("click", (event) => {
  if (event.target.classList.contains("custom_modal")) {
    custom_modal.classList.remove("custom_modal--visible")
  }
})
// Closes modal when exit key is pressed
document.addEventListener("keyup", (event) => {
  if (event.keyCode == 27 && custom_modal.classList.contains("custom_modal--visible")) {
    custom_modal.classList.remove("custom_modal--visible")
  }
})

/* ==== End of Modal / Post Popup Code ==== */




/* ==== Start of Global Feed Page Specific Code ==== */

if (document.querySelector(".global-feed")) {
  
  /* Start of Infinite Image Load */

  let reachedEnd = false
  // Detects when user has reached end of page, and sends off request to retrieve more posts
   document.addEventListener("scroll", () => {
    if (!reachedEnd) {
      if (window.scrollY + window.innerHeight >= document.body.offsetHeight) {
        asynchronousImageLoad()
      }
    }
  })

  let start = 9
  let end = 18
  // Sends off request to get more posts
  let asynchronousImageLoad = function() {
    fetch(`/dynamic-image-load/?start=${start}&end=${end}`)
    .then(response => response.json())
    .then(data => {
      // If the response contains posts...
      if (!data.empty) {
        // Loops over each new post, and inserts it into feed
        data.forEach(post => {
          insertPostIntoFeed(post)
        })
        // Increases start & end, so when the user reaches the end of page again
        // Then the next bunch of posts will be sent back
        start += 9
        end += 9
      } else {
        reachedEnd = true
      }
    }).catch(() => {
      console.log("There was an error fetching next global feed post.")
    })
  }

  let globalFeed = document.querySelector(".global-feed")
  // Creates the new image / post element, and appends it to feed. Also adds on event listener to new image.
  let insertPostIntoFeed = function(post) {
    let imgDiv = document.createElement("div")
    imgDiv.className = "post-img-div"

    let img = document.createElement("img")
    img.setAttribute("src", `/media/${post.image}`)
    img.setAttribute("alt", "Post Image")
    img.setAttribute("data-id", `${post.id}`)
    img.className = "post-img"

    imgDiv.insertAdjacentElement("beforeend", img)
    globalFeed.insertAdjacentElement("beforeend", imgDiv)

    img.addEventListener("click", () => {
      displayPost(img)
    })
  }

  /* End of Infinite Image Load */

  /* Start of Modal Related Code */

  // Adds on event listener to already loaded posts / images
  // Event listener watches for clicks to display modal
  let postImages = document.querySelectorAll(".post-img")
  postImages.forEach(post => post.addEventListener("click", () => {
    displayPost(post)
  }))

  // Watches for click on next button
  nextBtn.addEventListener("click", () => {
    let id = nextBtn.getAttribute("data-id")
    // Gets current element that is being displayed in modal
    let element = document.querySelector(`[data-id="${id}"]`)
    // Gets next element from global feed
    let nextElement = element.parentElement.nextElementSibling
    // Sends off request to load more posts if not a next element and if user hasn't reached first post
    if (!nextElement && id != 1) {
      asynchronousImageLoad()
    }
    // Timeout to allow all posts to load in
    setTimeout(() => {  
      // Tries to get next element again after asynchronous load
      nextElement = element.parentElement.nextElementSibling
      if (nextElement) {nextFunc(nextElement)}
    }, 50)
  })
  
  // Gets the image element & displays it in modal
  let nextFunc = function(nextElement) {
    if (nextElement.childNodes.length > 1) {
      nextElement = nextElement.childNodes[1]
    } else {
      nextElement = nextElement.children[0]
    }
    displayPost(nextElement)
  }

  // Watches for clicks on previous button
  previousBtn.addEventListener("click", () => {
    let id = previousBtn.getAttribute("data-id")
    // Gets current element that is being displayed in modal
    let element = document.querySelector(`[data-id="${id}"]`)
    // Gets next element from global feed
    let previousElement = element.parentElement.previousElementSibling
    if (previousElement) {
      previousFunc(previousElement)
    }
  })
  
  // Gets the image element & displays it in modal
  let previousFunc = function(previousElement) {
    if (previousElement.childNodes.length > 1) {
      previousElement = previousElement.childNodes[1]
    } else {
      previousElement = previousElement.children[0]
    }
    displayPost(previousElement)
  }
  
  /* End of Modal Related Code */
}

/* ==== End of Global Feed Page Code ==== */




/* ==== Start of Profile Page Code ==== */

if (document.querySelector(".profile-block")) {
  
  /* Start of Edit/Delete Modal Related Code */

  if (document.querySelector(".modify-post-btn")) {
    let deleteBtns = document.querySelectorAll(".delete-post-btn")
    let editBtns = document.querySelectorAll(".edit-post-btn")
    let modifyPostBtn = document.querySelector(".modify-post-btn")
    let editModal = document.querySelector(".edit-modal")
    let deleteModal = document.querySelector(".delete-modal")
    let modalExitBtns = document.querySelectorAll(".profile_modal__exit-btn")
    let modalDeleteBtn = document.querySelector(".profile_modal__button--delete")
    let modalUpdateBtn = document.querySelector(".profile_modal__update-btn")
    let modalUpdateTextArea = document.querySelector(".profile_modal__text")
    let modalUpdateCancelBtn = document.querySelector(".profile_modal__cancel-btn")
    let modalCancelBtn = document.querySelector(".profile_modal__button--cancel")

    // Modal Delete Button Action
    modalDeleteBtn.addEventListener("click", () => {
      let id = modalDeleteBtn.getAttribute("data-id")
      let post = document.querySelector(`[data-id="${id}"]`)
      // Sends off post request if user confirmed deletion
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
          deleteModal.classList.remove("profile_modal--visible")
          let currentPost = post
          // Removes the post from frontend
          currentPost.classList.add("fade-away-animation")
          currentPost.addEventListener("animationend", () => {
            currentPost.remove()
            // Checks to see if the user has any posts left
            if (!document.querySelector(".post-block")) {
              // Adds in empty post div if not
              document.querySelector(".row").innerHTML = `<div class='empty-profile-posts'>You do not have any posts.</div>`
            }
          })
        }
      }).catch(() => {
        console.log("There was an error deleting the post")
      })
    })

    // Modal Update Button Action
    modalUpdateBtn.addEventListener("click", () => {
      let id = modalUpdateBtn.getAttribute('data-id')
      let result = modalUpdateTextArea.value
      let postEditBtn = document.querySelector(`[data-id="${id}"]`).querySelector(".edit-post-btn")
      if (result) {
        // Sends off post request if user provided new text
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
            // Adds capital letter to beginning of description
            result = result.charAt(0).toUpperCase() + result.slice(1)
            // Adds new description to data-description, so it will be used if edit is clicked again
            postEditBtn.setAttribute("data-description", result)
            let descriptionSpan = postEditBtn.parentElement.parentElement.querySelector(".post-text")
            // Deals with formatting the post description
            if (result.length > 70) {
              descriptionSpan.innerHTML = result.substring(0, 69) + "..."
            } else if (result.length < 35) {
              descriptionSpan.innerHTML = result + "<br>"
            } else {
              descriptionSpan.innerHTML = result
            }
            editModal.classList.remove("profile_modal--visible")
          }
        }).catch(() => {
          console.log("There was an error updating the post")
        })
      }
    })

    // Modal Exit Button Action
    modalExitBtns.forEach(btn => btn.addEventListener("click", () => {
      let openedModal = document.querySelector(".profile_modal--visible")
      openedModal.classList.remove("profile_modal--visible")
    }))

    // Delete Modal Cancel Button Action
    modalCancelBtn.addEventListener("click", () => {
      let openedModal = document.querySelector(".profile_modal--visible")
      openedModal.classList.remove("profile_modal--visible")
    })

    // Edit Modal Cancel Button Action
    modalUpdateCancelBtn.addEventListener("click", () => {
      let openedModal = document.querySelector(".profile_modal--visible")
      openedModal.classList.remove("profile_modal--visible")
    })

    // Adds click event listener that will reveal the edit & delete buttons for each post
    modifyPostBtn.addEventListener("click", () => {
      if (!document.querySelector(".btn-visible")) {
        deleteBtns.forEach(btn => btn.classList.add("btn-visible"))
        editBtns.forEach(btn => btn.classList.add("btn-visible"))
      } else {
        deleteBtns.forEach(btn => btn.classList.remove("btn-visible"))
        editBtns.forEach(btn => btn.classList.remove("btn-visible"))
      }
    })

    // Fetch POST function that grabs cookie
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

    // Post Delete Btn Action (opens appropriate modal & transfers post information)
    deleteBtns.forEach(btn => btn.addEventListener("click", () => {
      let id = btn.getAttribute("data-id")
      modalDeleteBtn.setAttribute("data-id", id)
      deleteModal.classList.add("profile_modal--visible")
    }))

    // Post Edit Btn Action (opens appropriate modal & transfers post information)
    editBtns.forEach(btn => btn.addEventListener("click", () => {
      let id = btn.getAttribute("data-id")
      modalUpdateBtn.setAttribute("data-id", id)
      let description = btn.getAttribute("data-description")
      modalUpdateTextArea.value = description
      editModal.classList.add("profile_modal--visible")
      modalUpdateTextArea.focus()
    }))
  }

  /* End of Edit/Delete Modal Related Code */

  /* Start of Post Modal Related Code */

  let viewPostBtns = document.querySelectorAll(".view-post-btn")
  // Adds on click event listener to all view post buttons that will display modal
  viewPostBtns.forEach(btn => btn.addEventListener("click", () => {
    // Gets post object in relation to each btn
    let post = btn.parentElement.parentElement.parentElement.parentElement
    displayPost(post)
  }))

  // Adds on event listener to next button
  nextBtn.addEventListener("click", () => {
    let id = nextBtn.getAttribute("data-id")
    // Gets element that is currently displayed in modal
    let element = document.querySelector(`[data-id="${id}"]`)
    // Gets next element
    let nextElement = element.nextElementSibling
    // Replaces the current element with the next element
    if (nextElement) {
      displayPost(nextElement)
    }
  })

  // Adds on event listener to previous button
  previousBtn.addEventListener("click", () => {
    let id = previousBtn.getAttribute("data-id")
    // Gets element that is currently displayed in modal
    let element = document.querySelector(`[data-id="${id}"]`)
    // Gets previous element
    let previousElement = element.previousElementSibling
    // Replaces the current element with the next element
    if (previousElement) {
      displayPost(previousElement)
    }
  })

  /* End of Modal Related Code */

}

/* ==== End of Profile Page Code ==== */