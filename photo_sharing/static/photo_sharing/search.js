/* Start of Asynchronous Search Results */
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

/* End of Asynchronous Search Results */