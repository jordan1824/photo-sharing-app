// Create Post Page
if (document.querySelector(".create-post-title")) {
  const imageUpload = document.querySelector(".image-upload")
  const uploadedImageDiv = document.querySelector(".uploaded-image")
  const uploadImageBtn = document.querySelector(".upload-post-btn")
  let uploadedImage = document.querySelector("#uploadedImage")
  let uploadImageTextDiv = document.querySelector(".upload-image-text")

  imageUpload.addEventListener("change", function() {
    let uploadedFile = this.files[0]
    if (uploadedFile) {
      if (uploadedFile.type.includes("image")) {
        const reader = new FileReader()
        reader.addEventListener("load", function() {
          uploadedImage.setAttribute("src", this.result)
          uploadedImage.style.display = "initial"
          uploadImageTextDiv.style.display = "none"
          uploadImageBtn.innerHTML = `Image Uploaded <i class="fa fa-check-square-o success-btn-check" aria-hidden="true"></i>`
          uploadImageBtn.classList.add("success-btn")
        })
        reader.readAsDataURL(uploadedFile)
      } else {
        // Make this an alert message that disappears after 5 seconds
        uploadImageBtn.classList.remove("success-btn")
        uploadImageBtn.innerHTML = "Upload Post Image"
        uploadedImage.setAttribute("src", "")
        uploadedImage.style.display = "none"
        uploadImageTextDiv.style.display = "flex"
        alert("You must upload a JPEG/PNG Image File")
      }
    } else {
      uploadImageBtn.classList.remove("success-btn")
      uploadImageBtn.innerHTML = "Upload Post Image"
      uploadedImage.setAttribute("src", "")
      uploadedImage.style.display = "none"
      uploadImageTextDiv.style.display = "flex"
      alert("You must upload a JPEG/PNG Image File")
    }
  })

  let createPostForm = document.querySelector(".create-post-form")
  let postDescription = document.querySelector(".create-post-description")
  createPostForm.addEventListener("submit", (e) => {
    if (imageUpload.value) {
      if (!imageUpload.files[0].type.includes("image")) {
        e.preventDefault()
      }
    } else {
      e.preventDefault()
    }
    if (!postDescription.value) {
      e.preventDefault()
    }
  })
}

// Edit Profile Page
if (document.querySelector(".update-profile-image")) {
  const imageUpload = document.querySelector(".image-upload")
  const uploadedImageDiv = document.querySelector(".update-profile-image")
  const uploadImageBtn = document.querySelector(".update-profile-btn")
  let uploadedImage = document.querySelector("#uploadedImage")

  imageUpload.addEventListener("change", function() {
    let uploadedFile = this.files[0]
    if (uploadedFile) {
      if (uploadedFile.type.includes("image")) {
        const reader = new FileReader()
        reader.addEventListener("load", function() {
          uploadedImage.setAttribute("src", this.result)
          uploadImageBtn.innerHTML = `Image Uploaded <i class="fa fa-check-square-o success-btn-check" aria-hidden="true"></i>`
          uploadImageBtn.classList.add("success-btn")
        })
        reader.readAsDataURL(uploadedFile)
      } else {
        // Make this an alert message that disappears after 5 seconds
        uploadImageBtn.classList.remove("success-btn")
        uploadImageBtn.innerHTML = "Change Profile Picture"
        uploadedImage.setAttribute("src", "https://www.tibs.org.tw/images/default.jpg")
        alert("You must upload a JPEG/PNG Image File")
      }
    } else {
      uploadImageBtn.classList.remove("success-btn")
      uploadImageBtn.innerHTML = "Change Profile Picture"
      uploadedImage.setAttribute("src", "https://www.tibs.org.tw/images/default.jpg")
      alert("You must upload a JPEG/PNG Image File")
    }
  })

  let updateProfileForm = document.querySelector(".update-profile-form")
  let profileBio = document.querySelector(".update-profile-bio")
  updateProfileForm.addEventListener("submit", (e) => {
    if (imageUpload.value) {
      if (!imageUpload.files[0].type.includes("image")) {
        e.preventDefault()
      }
    }
    if (!profileBio.value) {
      e.preventDefault()
    }
  })
}
