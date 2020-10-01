class FormErrorMessage {
  constructor() {
    this.registerFormFields = document.querySelectorAll(".register-field")
    this.registerForm = document.querySelector(".register-form")
    // Counters to keep track of each alert
    this.usernameCounter = 0
    this.emailCounter = 0
    this.passwordCounter = 0
    this.passwordConfirmCounter = 0
    // Error tracker for each field
    this.usernameErrors = 0
    this.emailErrors = 0
    this.passwordErrors = 0
    this.passwordConfirmErrors = 0
    if (this.registerFormFields) {this.events()}
  }

  // Events
  events() {
    this.registerFormFields.forEach(field => field.addEventListener("keyup", () => {
      if (field.classList.contains("username")) {
        this.usernameFieldHandler(field)
      }
      if (field.classList.contains("email")) {
        this.emailFieldHandler(field)
      }
      if (field.classList.contains("password")) {
        this.passwordFieldHandler(field)
      }
      if (field.classList.contains("password-confirm")) {
        this.passwordConfirmFieldHandler(field)
      }
    }))
    this.registerForm.addEventListener("submit", (event) => {
      // Prevents submission when fields are empty
      this.registerFormFields.forEach(field => {
        if (field.value.length == 0) {
          event.preventDefault()
        }
      })
      // Prevents submission when there are errors
      let totalErrors = this.usernameErrors + this.emailErrors + this.passwordErrors + this.passwordConfirmErrors + this.firstNameErrors + this.lastNameErrors
      if (totalErrors > 0) {
        event.preventDefault()
      }
    })
  }

  // Models

  usernameFieldHandler(field) {
    this.usernameErrors = 0;
    clearTimeout(this.usernameCounter)
    if (field.value.length > 50) {this.usernameErrors = this.insertAlert(field, "Your username cannot exceed 50 characters.", this.usernameErrors)}
    if (field.value.match(/[$&+,:;=?@#|'<>.^*()%!_-]+/)) {this.usernameErrors = this.insertAlert(field, "Your username cannot contain special characters.", this.usernameErrors)}
    this.usernameTimedChecks(field)
    if (!this.usernameErrors) {
      this.removeAlert(field)
    }
  }

  usernameTimedChecks(field) {
    if (field.value.length > 0 && field.value.length < 4) {
      this.usernameCounter = setTimeout(() => this.usernameErrors = this.insertAlert(field, "Your username must be at least 4 characters long.", this.usernameErrors), 1500)
    }
    if (field.value.length == 0) {
      this.usernameCounter = setTimeout(() => this.usernameErrors = this.insertAlert(field, "You must enter a valid username.", this.usernameErrors), 1500)
    }
  }

  emailFieldHandler(field) {
    this.emailErrors = 0;
    clearTimeout(this.emailCounter)
    if (field.value.length > 200) {this.emailErrors = this.insertAlert(field, "Your email cannot exceed 200 characters.", this.emailErrors)}
    this.emailTimedChecks(field)
    if (!this.emailErrors) {
      this.removeAlert(field)
    }
  }

  emailTimedChecks(field) {
    if (!field.value.match(/[A-Za-z0-9]+@[a-zA-Z]+\.[a-zA-Z]+/)) {
      this.emailCounter = setTimeout(() => this.emailErrors = this.insertAlert(field, "You must provide a valid email address.", this.emailErrors), 1500)
    }
  }

  passwordFieldHandler(field) {
    this.passwordErrors = 0;
    clearTimeout(this.passwordCounter)
    if (field.value.length > 50) {this.passwordErrors = this.insertAlert(field, "Your password cannot exceed 50 characters.", this.passwordErrors)}
    this.passwordTimedChecks(field)
    if (!this.passwordErrors) {
      this.removeAlert(field)
    }
  }

  passwordTimedChecks(field) {
    if (field.value.length > 0 && field.value.length < 8) {
      this.passwordCounter = setTimeout(() => this.passwordErrors = this.insertAlert(field, "Your password must be at least 8 characters long.", this.passwordErrors), 1500)
    }
    if (field.value.length == 0) {
      this.passwordCounter = setTimeout(() => this.passwordErrors = this.insertAlert(field, "You must enter a valid password.", this.passwordErrors), 1500)
    }
  }

  passwordConfirmFieldHandler(field) {
    this.passwordConfirmErrors = 0;
    clearTimeout(this.passwordConfirmCounter)
    this.passwordConfirmTimedChecks(field)
    if (!this.passwordConfirmErrors) {
      this.removeAlert(field)
    }
  }

  passwordConfirmTimedChecks(field) {
    if (field.value != document.querySelector(".password").value) {
      this.passwordConfirmCounter = setTimeout(() => this.passwordConfirmErrors = this.insertAlert(field, "Your passwords do not match.", this.passwordConfirmErrors), 1500)
    }
  }

  insertAlert(field, message, errors) {
    errors += 1;
    if (!field.parentElement.querySelector(".form-alert")) {
      field.parentElement.insertAdjacentHTML("afterbegin", this.alertHTML(message))
      field.parentElement.querySelector(".form-alert").addEventListener("animationend", function() {
        this.classList.remove("error-popup-animation")
    })
    }
    return errors
  }

  alertHTML(error) {
    return `<div class='form-alert error-popup-animation'>
      <p class='error-message'>${error}</p>
    </div>`
  }

  removeAlert(field) {
    if (field.parentElement.querySelector(".form-alert")) {
      let currentFieldAlert = field.parentElement.querySelector(".form-alert")
      currentFieldAlert.classList.add("reverse-error-popup-animation")
      currentFieldAlert.addEventListener("animationend", function() {
        currentFieldAlert.remove()
      })
    }
  }

}

new FormErrorMessage()