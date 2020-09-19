/* Start of Asynchronous Search Results */
if (document.querySelector(".nav-search")) {
  let timer
  let navSearch = document.querySelector(".nav-search")
  let searchField = document.querySelector(".search-input")
  let searchResults = document.querySelector(".search-results")
  let loadingIcon = document.querySelector(".loading-icon")
  searchField.addEventListener("keyup", () => {
    loadingIcon.classList.add("loading-icon--visible")
    clearTimeout(timer)
    timer = setTimeout(showResults, 750)
  })

  function showResults() {
    loadingIcon.classList.remove("loading-icon--visible")
    let input = searchField.value
    if (input) {
      fetch(`/search/users/?search=${input}`)
      .then(response => response.json())
      .then(data => {
        if (data.length) {
          searchResults.innerHTML = ""
          data.forEach(user => {
            insertUserResult(user)
          })
          searchResults.classList.add("search-results--visible")
        } else {
          searchResults.classList.remove("search-results--visible")
          searchResults.innerHTML = ""
        }
      })
    } else {
      searchResults.classList.remove("search-results--visible")
      searchResults.innerHTML = ""
    }
  }

  function insertUserResult(user) {
    let username = user.username.charAt(0).toUpperCase() + user.username.slice(1)
    let userResultHTML = `
      <a href="/user/profile/${user.username}" class="user-result-link">  
      <div class='search-result'>
        <div class='search-img'>
            <img src="/media/${user.profileImage}" alt="User image">
        </div>
        <h2 class='search-username'>${username}</h2>
      </div>
      </a>`
    searchResults.insertAdjacentHTML("beforeend", userResultHTML)
  }

  document.addEventListener("click", (event) => {
    if (event.target == searchField) {
      if (!searchResults.classList.contains("search-results--visible")) {
        showResults()
      }
    }
    if (document.querySelector(".search-results--visible")) {
      if (event.target != searchResults || event.target != navSearch) {
        searchResults.classList.remove("search-results--visible")
      }
    }
  })
}

/* End of Asynchronous Search Results */

// Tooltip
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})


/* Follow & Unfollow Button Actions */
if (document.querySelector(".user-btn")) {
  let followBtns = document.querySelectorAll(".follow")
  let unfollowBtns = document.querySelectorAll(".unfollow")

  // Follow Btn Code

  followBtns.forEach(btn => btn.addEventListener("click", event => {
    event.preventDefault()
    console.log("follow event listener ran")
    let id = btn.getAttribute("data-id")
    followUser(btn, id)
  }))

  function followUser(btn, id) {
    fetch(`/user/follow/${id}/`)
    .then(response => response.text())
    .then(text => {
      if (text == "Success") {
        btn.innerHTML = `Unfollow <i class="fa fa-user" aria-hidden="true"></i>`
        // Replace btn with new btn that has unfollow event listener
        let newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener("click", event => {
          event.preventDefault()
          unfollowUser(newBtn, id)
        })
      }
    })
    .catch(function() {
      console.log("Please try again later.")
    })
  }

  // Unfollow Btn Code

  unfollowBtns.forEach(btn => btn.addEventListener("click", event => {
    event.preventDefault()
    console.log("unfollow event listener ran")
    let id = btn.getAttribute("data-id")
    unfollowUser(btn, id)
  }))

  function unfollowUser(btn, id) {
    fetch(`/user/unfollow/${id}/`)
    .then(response => response.text())
    .then(text => {
      if (text == "Success") {
        btn.innerHTML = `Follow <i class="fa fa-user" aria-hidden="true"></i>`
        // Replace btn with new btn that has follow event listener
        let newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener("click", event => {
          event.preventDefault()
          followUser(newBtn, id)
        })
      }
    })
    .catch(function() {
      console.log("Please try again later.")
    })
  }
}