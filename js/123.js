const setError = (element, message) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");

  errorDisplay.innerText = message;
  inputControl.classList.add("error");
  inputControl.classList.remove("success");
};

const setSuccess = (element) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");

  errorDisplay.innerText = "";
  inputControl.classList.add("success");
  inputControl.classList.remove("error");
};

const isValidEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const validateInputs = () => {
  const form = document.getElementById("form");
  const username = document.getElementById("username");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const password2 = document.getElementById("password2");
  const usernameValue = username.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();
  const password2Value = password2.value.trim();

  $validate = 1;
  if (usernameValue === "") {
    setError(username, "Username is required");

    $validate = 0;
  } else {
    setSuccess(username);
  }

  if (emailValue === "") {
    setError(email, "Email is required");
    $validate = 0;
  } else if (!isValidEmail(emailValue)) {
    setError(email, "Provide a valid email address");
    $validate = 0;
  } else {
    setSuccess(email);
  }

  if (passwordValue === "") {
    setError(password, "Password is required");
    $validate = 0;
  } else if (passwordValue.length < 8) {
    setError(password, "Password must be at least 8 character.");
    $validate = 0;
  } else {
    setSuccess(password);
  }

  if (password2Value === "") {
    setError(password2, "Please confirm your password");
    $validate = 0;
  } else if (password2Value !== passwordValue) {
    setError(password2, "Passwords doesn't match");
    $validate = 0;
  } else {
    setSuccess(password2);
  }
  console.log($validate);
  return $validate ? true : false;
};
