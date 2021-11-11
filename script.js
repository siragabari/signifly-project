// Object that stores the user data
const User = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gametag: "",
    password: "",
    games: "",
    skills: ""
};

let newUser;
let error = 0;
let usedGametags;
let usedEmails;

let selectedGames;
let selectedSkills;

import eyeOpen from "./public/eye.png";
import eyeClose from "./public/eye_crossed.png";
import webBackground from "./public/web_background.png";
import logoSvg from "./public/logo.svg";
import check from "./public/check.png";

export const start = () => {
    // Set background image
    document.body.style.backgroundImage = "url("+webBackground+")";
    // Set checkboxes image
    document.querySelectorAll("input[type=checkbox]").forEach(function(element) {
        if(element.checked === true) {
            element.style.backgroundImage = "url("+check+")";
        }
    });
    // Open the form
    document.getElementById("start").addEventListener('click', managingForm);
    // Close the form
    document.getElementById("close").addEventListener('click', function() {
        clearing();
        document.getElementById("info-wrapper").style.display = "none";
        document.getElementById("form-container").style.display = "none";
    });
}

function clearing() {
    // Clear input text and email boxes
    document.querySelectorAll("input:not([type=checkbox])").forEach(function(element) {
        element.value = "";
    });
    // Clear input checkboxes
    document.querySelectorAll("input[type=checkbox]").forEach(function(element) {
        element.checked = false;
    });
    // Clear errors
    document.querySelectorAll(".error").forEach(function(element) {
        element.style.visibility = "hidden";
    });
    document.querySelectorAll(".mistake").forEach(function(element) {
        element.classList.remove("mistake");
    });
    // Reset passwords
    document.getElementById("password").type = "password";
    document.getElementById("togglePassword").src = eyeClose;
    document.getElementById("confirmPassword").type = "password";
    document.getElementById("toggleConfirmPassword").src = eyeClose;
}

function managingForm() {
    // Create a newUser Object
    newUser = Object.create(User);
    // Get the registered users from restdb.io
    getUsers();
    // Toggle passwords
    document.getElementById('togglePassword').addEventListener('click', togglingPassword);
    document.getElementById('toggleConfirmPassword').addEventListener('click', togglingConfirmPassword);

    // Show the form
    document.getElementById("form-container").style.display = "block";
    // Load the logo from an svg file
    logo();
    // Style the container line 
    line();
    // Show the first page
    savingUserInterests();
}

function getUsers () {
    usedGametags = [];
    usedEmails = [];
    // GET method to obtain the registered users
    fetch("https://signiflyproject-7ef5.restdb.io/rest/users-list", {
        method: "get",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "x-apikey": "618cb901fc71545b0f5e06b0",
          "cache-control": "no-cache"
      } })
        .then(e => e.json())
        .then(e => {
            // Save the used emails and gametags
            for(let i=0; i < e.length; i++) {
                usedEmails.push(e[i].email);
                usedGametags.push(e[i].gametag);
            }
        });
}

async function logo() {
    // Load logo from svg file
    let response = await fetch(logoSvg);
    let data = await response.text();
    document.getElementById("logo").innerHTML = data;
    // Assign class to each part of the logo
    document.getElementById("outline").classList.add("darkPart");
    document.getElementById("background").classList.add("lightPart");
    document.getElementById("letter1").classList.add("darkPart");
    document.getElementById("letter2").classList.add("darkPart");
}

function line() {
    // Create path to fit svg
    const svg = document.getElementById('line');
    const height = svg.clientHeight;
    const width = svg.clientWidth;
    const d = "M " + (width-width/2.7) + " 0 L " + width + " 0 L " + width + " " + height + " L 0 " + height + "L 0 0 L " + (width/2.7) + " 0";
    path.setAttribute('d', d);
    path.setAttribute('style', 'stroke-dasharray:'+path.getTotalLength()+';stroke-dashoffset:'+path.getTotalLength());
}

function togglingPassword() {
    // Change password type and eye icon on click
    const password = document.getElementById('passwordIn');
    if (password.type === "password") {
        password.type = "text";
        document.getElementById('togglePassword').src= eyeOpen;
    } else {
        password.type = "password";
        document.getElementById('togglePassword').src= eyeClose;
    }
}

function togglingConfirmPassword() {
    // Change password type and eye icon on click
    const confirmPassword = document.getElementById('confirmPasswordIn');
    if (confirmPassword.type === "password") {
        confirmPassword.type = "text";
        document.getElementById('toggleConfirmPassword').src= eyeOpen;
    } else {
        confirmPassword.type = "password";
        document.getElementById('toggleConfirmPassword').src= eyeClose;
    }
}

function savingUserInterests() {
    // Show the first page
    document.getElementById("userInterests").style.display = "block";
    // Clear the first page
    document.getElementById("clear1").addEventListener('click', clearing);
    // Save the data in the newUser Object
    document.getElementById("continue").addEventListener('click', continuing);
}

function continuing() {
    // Check selected games and skills
    error = 0;
    checkGames();
    checkSkills();
    if(error === 0) {
        console.log(selectedGames);
        // Show the second page
        document.getElementById("userInterests").style.display = "none";
        savingUserInformation();
    }
}

function checkGames() {
    // Save the checked games
    selectedGames = [];
    document.querySelectorAll(".game").forEach(function(element) {
        if(element.checked) {
            selectedGames.push(element.value);
        }
    });
    // Check if there are enough checked games
    if (selectedGames.length < 3) {
        error++;
        document.getElementById("gamesError").style.visibility = "visible";
    }else {
        document.getElementById("gamesError").style.visibility = "hidden";
    }
}

function checkSkills() {
    // Save the checked skills
    selectedSkills = [];
    document.querySelectorAll(".skill").forEach(function(element) {
        if(element.checked) {
            selectedSkills.push(element.value);
        }
    });
    // Check if there are enough checked skills
    if (selectedSkills.length < 3) {
        error++;
        document.getElementById("skillsError").style.visibility = "visible";
    }else {
        document.getElementById("skillsError").style.visibility = "hidden";
    }
}

function savingUserInformation() {
    // Show the second page
    document.getElementById("info-wrapper").style.display = "block";
    // Reset outline when an error is resolved
    resetOutline();
    // Clear the second page
    document.getElementById("clear2").addEventListener('click', clearing);
    // Save the user information
    document.getElementById("signUp").addEventListener('click', signingUp);
}

function signingUp() {
    // Check errors
    checkUserInfo();
    if(error === 0) {
        // POST user in restdb.io
        saveData();
        post();
    }
}


function resetOutline() {
    // Restore input text outlines when an error is resolved
    document.querySelectorAll("input:not([type=checkbox])").forEach(function(element) {
        element.addEventListener('change', function() {
            element.classList.remove("mistake");
        });
    });
}

// Check all the user information
function checkUserInfo() {
    error = 0;
    checkFirstName();
    checkLastName();
    checkEmail();
    checkPhoneNumber();
    checkGameTag();
    checkConfirmPassword();
    checkPassword();
}

function checkFirstName() {
    // Check first name length
    const firstName = document.getElementById("firstNameIn");
    if(firstName.value === "") {
        error++;
        document.getElementById("firstNameError").style.visibility = "visible";
        firstName.classList.add("mistake");
    }else {
        document.getElementById("firstNameError").style.visibility = "hidden";
        document.getElementById("firstNameIn").classList.remove("mistake");
    }
}

function checkLastName() {
    // Check last name length
    const lastName = document.getElementById("lastNameIn");
    if(lastName.value === "") {
        error++;
        document.getElementById("lastNameError").style.visibility = "visible";
        lastName.classList.add("mistake");
    }else {
        document.getElementById("lastNameError").style.visibility = "hidden";
        lastName.classList.remove("mistake");
    }
}

function checkEmail() {
    // Check email
    const email = document.getElementById("emailIn");
    if(email.value === "") {
        error++;
        document.getElementById("emailError").innerHTML = "Please enter a valid email";
        document.getElementById("emailError").style.visibility = "visible";
        email.classList.add("mistake");
    }else {
        // Check that email has the correct format
        if(!validateEmail(email.value)) {
            error++;
            document.getElementById("emailError").innerHTML = "Email format is incorrect";
            document.getElementById("emailError").style.visibility = "visible";
        }else {
            // Check that emial has not been used by another user
            if(usedEmails.includes(email.value)) {
                error++;
                document.getElementById("emailError").innerHTML = "This email has been used already";
                document.getElementById("emailError").style.visibility = "visible";
            }else {
                document.getElementById("emailError").style.visibility = "hidden";
                email.classList.remove("mistake");
            }
        }
    }
}
// Check email format
function validateEmail(string) {
    let regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return regex.test(string);
}

function checkPhoneNumber() {
    // Check that phone number only contains numbers
    const phone = document.getElementById("phoneIn");
    if(phone.value != "" && !/^\d+$/.test(document.getElementById("phoneIn").value)) {
        error++;
        document.getElementById("phoneError").style.visibility = "visible";
        phone.classList.add("mistake");
    }else {
        document.getElementById("phoneError").style.visibility = "hidden";
        phone.classList.remove("mistake");
    }
}

function checkGameTag() {
    // Check gametag length
    const gametag = document.getElementById("gametagIn");
    if(document.getElementById("gametagIn").value.length < 5) {
        error++;
        document.getElementById("gametagError").innerHTML = "Gametag must have a minimum of 5 characters";
        document.getElementById("gametagError").style.visibility = "visible";
        gametag.classList.add("mistake");
    }else {
        // Check that gametag has not been used by another user
        if(usedGametags.includes(gametag.value)) {
            error++;
            document.getElementById("gametagError").innerHTML = "This gametag is already taken";
            document.getElementById("gametagError").style.visibility = "visible";
        }else {
            document.getElementById("gametagError").style.visibility = "hidden";
            gametag.classList.remove("mistake");
        }
    }
}

function checkPassword() {
    // Check password length
    const password = document.getElementById("passwordIn");
    if(password.value.length < 5) {
        error++;
        document.getElementById("passwordError").innerHTML = "Password must have a minimum of 5 characters";
        document.getElementById("passwordError").style.visibility = "visible";
        password.classList.add("mistake");
    }else {
        // Check password content
        if(!checkNumber(password.value) || !checkLowerCase(password.value) || !checkUpperCase(password.value)) {
            error++;
            document.getElementById("passwordError").innerHTML = "Password must contain a lowercase letter, an uppercase letter and a number";
            document.getElementById("passwordError").style.visibility = "visible";
            password.classList.add("mistake");
        }else {
            document.getElementById("passwordError").style.visibility = "hidden";
            password.classList.remove("mistake");
        }
    }
}
// Check if a string contains lowercase letters
function checkLowerCase(string) {
    return (/[a-z]/.test(string));
}
//Check if a string contains uppercase letters
function checkUpperCase(string) {
    return (/[A-Z]/.test(string));
}
// Check if a string contains numbers
function checkNumber(string) {
    return /\d/.test(string);
}

function checkConfirmPassword() {
    // Check that confirm password is the same as password
    const confirmPassword = document.getElementById("confirmPasswordIn");
    if(confirmPassword.value != document.getElementById("passwordIn").value || document.getElementById("passwordIn").value === "") {
        error++;
        document.getElementById("confirmPasswordError").style.visibility = "visible";
        confirmPassword.classList.add("mistake");
    }else {
        document.getElementById("confirmPasswordError").style.visibility = "hidden";
        confirmPassword.classList.remove("mistake");
    }
}

function saveData() {
    newUser.firstName = document.getElementById("firstNameIn").value;
    newUser.lastName = document.getElementById("lastNameIn").value;
    newUser.email = document.getElementById("emailIn").value;
    newUser.phoneNumber = "+" + document.getElementById("countryCode").value + " " + document.getElementById("phoneIn").value;
    newUser.gametag = document.getElementById("gametagIn").value;
    newUser.password = document.getElementById("passwordIn").value;
    newUser.games = selectedGames.join(", ");
    newUser.skills = selectedSkills.join(", ");
}

function post() {
    const postData = JSON.stringify(newUser);
    fetch("https://signiflyproject-7ef5.restdb.io/rest/users-list", {
    method: "post",
    headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-apikey": "618cb901fc71545b0f5e06b0",
        "cache-control": "no-cache"
    },
    body: postData
    })
    .then(res => res.json())
    .then(data => {
            // User registered message
            alert("User @" + newUser.gametag + " has been registered successfully");
            // Clear form
            clearing();
            // Hide the form
            document.getElementById("info-wrapper").style.display = "none";
            document.getElementById("form-container").style.display = "none";
    });
}




