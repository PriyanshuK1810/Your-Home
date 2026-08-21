/* =========================================================
   YOURHOME LOGIN JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const loginForm = document.getElementById("loginForm");

    const identifierInput = document.getElementById("identifier");

    const passwordInput = document.getElementById("password");

    const passwordToggle =
        document.getElementById("passwordToggle");

    const rememberMe =
        document.getElementById("rememberMe");

    const loginButton =
        document.querySelector(".login-button");

    const forgotPassword =
        document.querySelector(".forgot-password");

    const registerLink =
        document.querySelector(".register-section a");

    const socialButtons =
        document.querySelectorAll(".social-button");

    const backgroundVideo =
        document.getElementById("backgroundVideo");


    /* =====================================================
       TOAST SYSTEM
    ===================================================== */

    function showToast(message, type = "success") {

        let toast = document.querySelector(".toast");

        /* Create toast if it doesn't exist */
        if (!toast) {

            toast = document.createElement("div");

            toast.className = "toast";

            toast.innerHTML = `
                <div class="toast-icon">
                    <i class="fa-solid fa-check"></i>
                </div>

                <div class="toast-content">
                    <strong>Notification</strong>
                    <p></p>
                </div>

                <button class="toast-close">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            `;

            document.body.appendChild(toast);

            toast.querySelector(".toast-close")
                .addEventListener("click", () => {
                    hideToast();
                });
        }


        const icon =
            toast.querySelector(".toast-icon i");

        const title =
            toast.querySelector(".toast-content strong");

        const text =
            toast.querySelector(".toast-content p");


        /* Remove previous type */
        toast.classList.remove(
            "success",
            "error",
            "warning"
        );


        /* Set notification */
        if (type === "success") {

            title.textContent = "Success";

            icon.className =
                "fa-solid fa-circle-check";

        }

        else if (type === "error") {

            title.textContent = "Error";

            icon.className =
                "fa-solid fa-circle-exclamation";

        }

        else {

            title.textContent = "Notice";

            icon.className =
                "fa-solid fa-circle-info";
        }


        toast.classList.add(type);

        text.textContent = message;

        toast.classList.add("show");


        /* Automatically hide */
        clearTimeout(window.toastTimer);

        window.toastTimer = setTimeout(() => {

            hideToast();

        }, 3500);
    }


    function hideToast() {

        const toast =
            document.querySelector(".toast");

        if (toast) {

            toast.classList.remove("show");

        }
    }


    /* =====================================================
       SHOW / HIDE PASSWORD
    ===================================================== */

    if (passwordToggle) {

        passwordToggle.addEventListener("click", () => {

            const isPassword =
                passwordInput.type === "password";


            if (isPassword) {

                passwordInput.type = "text";

                passwordToggle.innerHTML =
                    '<i class="fa-regular fa-eye-slash"></i>';

                passwordToggle.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            }

            else {

                passwordInput.type = "password";

                passwordToggle.innerHTML =
                    '<i class="fa-regular fa-eye"></i>';

                passwordToggle.setAttribute(
                    "aria-label",
                    "Show password"
                );

            }

        });

    }


    /* =====================================================
       EMAIL VALIDATION
    ===================================================== */
    function validateUsername(username) {
        return /^[a-zA-Z0-9_]{3,30}$/.test(username);
    }
    function validateEmail(email) {
        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailPattern.test(email);
    }


    /* =====================================================
       PASSWORD VALIDATION
    ===================================================== */

    function validatePassword(showMessage = true) {

        const password =
            passwordInput.value;


        if (password === "") {

            if (showMessage) {

                showInputError(
                    passwordInput,
                    "Password is required."
                );

            }

            return false;
        }


        if (password.length < 6) {

            if (showMessage) {

                showInputError(
                    passwordInput,
                    "Password must contain at least 6 characters."
                );

            }

            return false;
        }


        clearInputError(passwordInput);

        return true;
    }


    /* =====================================================
       INPUT ERROR
    ===================================================== */

    function showInputError(input, message) {

        input.classList.add("input-error");

        let error =
            input.parentElement.parentElement
                .querySelector(".input-error-message");


        if (!error) {

            error =
                document.createElement("small");

            error.className =
                "input-error-message";

            input.parentElement.parentElement
                .appendChild(error);
        }


        error.textContent = message;

    }


    function clearInputError(input) {

        input.classList.remove("input-error");

        const error =
            input.parentElement.parentElement
                .querySelector(".input-error-message");


        if (error) {

            error.remove();

        }
    }


    /* =====================================================
       REAL-TIME EMAIL VALIDATION
    ===================================================== */

    identifierInput.addEventListener("input", () => {
        if (identifierInput.value.trim() !== "") {
            clearInputError(identifierInput);
        }
    });


    /* =====================================================
       PASSWORD INPUT FEEDBACK
    ===================================================== */

    passwordInput.addEventListener("input", () => {

        if (passwordInput.value.length > 0) {

            clearInputError(passwordInput);

        }

    });


    /* =====================================================
       REMEMBER ME
    ===================================================== */

    const savedIdentifier =
        localStorage.getItem("yourhome_identifier");


    if (savedIdentifier) {

        identifierInput.value = savedIdentifier;
        rememberMe.checked = true;
    }


    /* =====================================================
       LOGIN SUBMIT
    ===================================================== */

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const identifier = identifierInput.value.trim();
        const password = passwordInput.value;

        const identifierValid =
            validateEmail(identifier) ||
            validateUsername(identifier);

        const passwordValid =
            validatePassword(password) 
            

        if (!identifierValid || !passwordValid) {
            showToast(
                "Please Correct the Highlighted fields.",
                "error"
            );
            return;
        }

        //Remember Me 
        if (rememberMe.checked) {
            localStorage.setItem(
                "yourhome_identifier"
            );
        }
        else {
            localStorage.removeItem(
                "yourhome_identifier"
            );
        }

        //Prevent Double-click
        if (loginButton.disabled) {
            return;
        }
        loginButton.disabled = true;
        loginButton.classList.add("Loading");

        const originalButton = loginButton.innerHTML;
        loginButton.innerHTML =
            `<span class="login-loading">
                <i class="fa-solid fa-spinner fa-spin"></i>
                Signing in...
            </span>`
            ;

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    identifier: identifier,
                    password: password
                })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(
                    data.message || "Login failed"
                );
            }
            localStorage.setItem(
                "token",
                data.token
            );

            if (data.user) {
                localStorage.setItem(
                    "yourHome_user",
                    JSON.stringify(data.user)
                );
            }

            showToast(
                "Login Successful",
                "success"
            );

            setTimeout(() => {
                window.location.href = "/";
            }, 700);
        }
        catch (error) {
            console.error("Login Error: ", error);
            showToast(
                error.message || "Unable to Login. Please try Again",
                "error"
            );
            loginButton.disabled = false;
            loginButton.classList.remove("Loading")
            loginButton.innerHTML = originalButton
        }
    });


    /* =====================================================
       FORGOT PASSWORD
    ===================================================== */

    forgotPassword.addEventListener("click", (event) => {

        event.preventDefault();
        showToast(
            "Password Reset Functionality is not available yet",
            "warning"
        );
    });


    /* =====================================================
       REGISTER
    ===================================================== */

    registerLink.addEventListener("click", (event) => {

        event.preventDefault();
        window.location.href = "/register";


        showToast(
            "Opening the registration page...",
            "success"
        );

    });


    /* =====================================================
       GOOGLE / MICROSOFT LOGIN
    ===================================================== */

    socialButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const text =
                button.textContent.trim();


            if (text.includes("Google")) {

                showToast(
                    "Google login will open here.",
                    "success"
                );

            }

            else if (text.includes("Microsoft")) {

                showToast(
                    "Microsoft login will open here.",
                    "success"
                );

            }

        });

    });


    /* =====================================================
       BACKGROUND VIDEO
    ===================================================== */

    if (backgroundVideo) {

        /* Make sure video starts */
        backgroundVideo.play()
            .catch(() => {

                console.log(
                    "Autoplay was blocked by the browser."
                );

            });


        /* If video cannot load */
        backgroundVideo.addEventListener(
            "error",
            () => {

                document.querySelector(
                    ".video-background"
                ).classList.add("video-error");

                showToast(
                    "Background video could not be loaded.",
                    "warning"
                );

            }
        );


        /*
         * Pause video when browser tab
         * is not visible.
         */

        document.addEventListener(
            "visibilitychange",
            () => {

                if (
                    document.hidden
                ) {

                    backgroundVideo.pause();

                }

                else {

                    backgroundVideo.play()
                        .catch(() => { });

                }

            }
        );

    }


    /* =====================================================
       INPUT FOCUS ANIMATION
    ===================================================== */

    const inputs =
        document.querySelectorAll(
            ".input-wrapper input"
        );


    inputs.forEach((input) => {

        input.addEventListener(
            "focus",
            () => {

                input.parentElement
                    .classList.add("focused");

            }
        );


        input.addEventListener(
            "blur",
            () => {

                input.parentElement
                    .classList.remove("focused");

            }
        );

    });


    /* =====================================================
       ENTER KEY SUPPORT
    ===================================================== */

    passwordInput.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {

                loginForm.requestSubmit();

            }

        }
    );


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {

                hideToast();

            }

        }
    );


    /* =====================================================
       INITIAL MESSAGE
    ===================================================== */

    console.log(
        "YourHome Login System initialized successfully."
    );

});


/*const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

const loginMessage = document.getElementById("loginMessage");

const loginBtn = document.getElementById("loginBtn");
const loginText = document.getElementById("loginText");
const loadingText = document.getElementById("loadingText");

const togglePassword = document.getElementById("togglePassword");


// ===============================
// EMAIL VALIDATION
// ===============================

function validateEmail(email) {

    const emailPattern =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailPattern.test(email);
}


// ===============================
// CLEAR ERRORS
// ===============================

function clearErrors() {

    emailError.textContent = "";
    passwordError.textContent = "";

    document.querySelectorAll(".input-box").forEach(box => {
        box.classList.remove("error");
        box.classList.remove("success");
    });

    loginMessage.textContent = "";
    loginMessage.className = "login-message";
}


// ===============================
// EMAIL REAL-TIME VALIDATION
// ===============================

identifierInput.addEventListener("input", function () {

    const identifier = identifierInput.value.trim();

    if (identifier === "") {

        identifierError.textContent = "Email or username is required";

        identifierInput.parentElement.classList.add("error");
        identifierInput.parentElement.classList.remove("success");

    } else if (
        !validateEmail(identifier) &&
        !validateUsername(identifier)
    ) {

        identifierError.textContent =
            "Please enter a valid email address or username";

        identifierInput.parentElement.classList.add("error");
        identifierInput.parentElement.classList.remove("success");

    } else {

        identifierError.textContent = "";

        identifierInput.parentElement.classList.remove("error");
        identifierInput.parentElement.classList.add("success");
    }
});

// ===============================
// PASSWORD VALIDATION
// ===============================

passwordInput.addEventListener("input", function () {

    const password = passwordInput.value;

    if (password === "") {

        passwordError.textContent = "Password is required";

        passwordInput.parentElement.classList.add("error");
        passwordInput.parentElement.classList.remove("success");

    } else {

        passwordError.textContent = "";

        passwordInput.parentElement.classList.remove("error");
        passwordInput.parentElement.classList.add("success");
    }
});


// ===============================
// SHOW / HIDE PASSWORD
// ===============================

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";
        togglePassword.textContent = "🙈";

    } else {

        passwordInput.type = "password";
        togglePassword.textContent = "👁";
    }
});


// ===============================
// LOGIN
// ===============================

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    clearErrors();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    let valid = true;


    // Check email

    if (email === "") {

        emailError.textContent = "Email is required";

        emailInput.parentElement.classList.add("error");

        valid = false;

    } else if (!validateEmail(email)) {

        emailError.textContent =
            "Please enter a valid email address";

        emailInput.parentElement.classList.add("error");

        valid = false;
    }


    // Check password

    if (password === "") {

        passwordError.textContent =
            "Password is required";

        passwordInput.parentElement.classList.add("error");

        valid = false;
    }


    // Stop if basic validation fails

    if (!valid) {
        return;
    }


    // ===============================
    // GET REGISTERED USER
    // ===============================

    const registeredUser =
        JSON.parse(localStorage.getItem("registeredUser"));


    // No registered account

    if (!registeredUser) {

        loginMessage.textContent =
            "No account found. Please register first.";

        loginMessage.classList.add("error");

        return;
    }


    // ===============================
    // CHECK EMAIL
    // ===============================

    if (email !== registeredUser.email.toLowerCase()) {

        emailError.textContent =
            "This email is not registered.";

        emailInput.parentElement.classList.add("error");

        return;
    }


    // ===============================
    // CHECK PASSWORD
    // ===============================

    if (password !== registeredUser.password) {

        passwordError.textContent =
            "Incorrect password.";

        passwordInput.parentElement.classList.add("error");

        return;
    }


    // ===============================
    // LOGIN SUCCESS
    // ===============================

    loginBtn.disabled = true;

    loginText.style.display = "none";
    loadingText.style.display = "inline";


    loginMessage.textContent =
        "Login successful! Redirecting...";

    loginMessage.classList.add("success");


    // Save login status

    localStorage.setItem("isLoggedIn", "true");


    // Redirect after 1.5 seconds

    setTimeout(() => {

        window.location.href = "dashboard.html";

    }, 1500);

*/