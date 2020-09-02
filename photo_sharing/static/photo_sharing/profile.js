
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

// View Post Btn Action
let viewPostBtns = document.querySelectorAll(".view-post-btn")
viewPostBtns.forEach(btn => btn.addEventListener("click", () => {
  alert("working")
}))
