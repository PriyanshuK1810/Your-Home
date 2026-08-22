document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registerForm");

    const name = document.getElementById("name");
    const username = document.getElementById("username");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword =
        document.getElementById("confirmPassword");

    const nameError =
        document.getElementById("nameError");

    const usernameError =
        document.getElementById("usernameError");

    const emailError =
        document.getElementById("emailError");

    const passwordError =
        document.getElementById("passwordError");

    const confirmPasswordError =
        document.getElementById("confirmPasswordError");

    const registerMessage =
        document.getElementById("registerMessage");

    const registerButton =
        document.getElementById("registerButton");

    const registerRoute = "/api/register";


    /* ===============================
       VALIDATION FUNCTIONS
    =============================== */

    function validEmail(value) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    }


    function validUsername(value) {

        return /^[a-zA-Z0-9_]{3,20}$/.test(value);

    }


    function validPassword(value) {

        return value.length >= 8;

    }


    /* ===============================
       PASSWORD SHOW / HIDE
    =============================== */

    function setupPasswordToggle(input, button) {

        button.addEventListener("click", () => {

            const icon = button.querySelector("i");

            if (input.type === "password") {

                input.type = "text";

                icon.classList.remove("fa-eye");

                icon.classList.add("fa-eye-slash");

            } else {

                input.type = "password";

                icon.classList.remove("fa-eye-slash");

                icon.classList.add("fa-eye");

            }

        });

    }


    setupPasswordToggle(
        password,
        document.getElementById("togglePassword")
    );


    setupPasswordToggle(
        confirmPassword,
        document.getElementById("toggleConfirmPassword")
    );


    /* ===============================
       FORM SUBMIT
    =============================== */

    form.addEventListener("submit", async (event) => {

        event.preventDefault();


        /* Clear previous errors */

        nameError.textContent = "";
        usernameError.textContent = "";
        emailError.textContent = "";
        passwordError.textContent = "";
        confirmPasswordError.textContent = "";

        registerMessage.textContent = "";

        registerMessage.className =
            "register-message";


        let valid = true;


        /* ===============================
           NAME
        =============================== */

        const nameValue =
            name.value.trim();

        if (nameValue.length < 2) {

            nameError.textContent =
                "Please enter your name.";

            valid = false;

        }


        /* ===============================
           USERNAME
        =============================== */

        const usernameValue =
            username.value.trim();

        if (!validUsername(usernameValue)) {

            usernameError.textContent =
                "Username must be 3-20 characters.";

            valid = false;

        }


        /* ===============================
           EMAIL
        =============================== */

        const emailValue =
            email.value.trim().toLowerCase();

        if (!validEmail(emailValue)) {

            emailError.textContent =
                "Please enter a valid email address.";

            valid = false;

        }


        /* ===============================
           PASSWORD
        =============================== */

        const passwordValue =
            password.value;

        if (!validPassword(passwordValue)) {

            passwordError.textContent =
                "Password must contain at least 8 characters.";

            valid = false;

        }


        /* ===============================
           CONFIRM PASSWORD
        =============================== */

        const confirmPasswordValue =
            confirmPassword.value;

        if (!confirmPasswordValue) {

            confirmPasswordError.textContent =
                "Please confirm your password.";

            valid = false;

        } else if (
            passwordValue !== confirmPasswordValue
        ) {

            confirmPasswordError.textContent =
                "Passwords do not match.";

            valid = false;

        }


        /* Stop if invalid */

        if (!valid) {

            return;

        }


        // Register User With Backend

        registerButton.disabled = true;
        registerButton.classList.add("Loading");

        try {
            const response = await fetch(registerRoute, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: nameValue,
                    username: usernameValue,
                    email: emailValue,
                    password: passwordValue
                })
            });
            const data = await response.json();

            //Backend Error

            if (!response.ok) {
                if (response.status === 409) {
                    if (
                        data.message
                            .toLowerCase()
                            .includes("email")
                    ) {
                        emailError.textContent = "This Email is already registered";
                    }
                    else if (
                        data.message
                            .toLowerCase()
                            .includes("username")
                    ) {
                        usernameError.textContent = "This Username is already taken";
                    }
                    else {
                        registerMessage.textContent = data.message;
                        registerMessage.className = "Register-Message Error";
                    }
                }
                else {
                    registerMessage.textContent = data.message || "Registration Failed";
                    registerMessage.className = "Register-Message Error";
                }
                registerButton.disabled = false;
                registerButton.classList.remove("Loading");
                return;
            }



            //Success
            registerMessage.textContent =
                "Account created successfully!";

            registerMessage.className =
                "register-message success";
            ;


            //Redirect To Login    
            setTimeout(() => {

                window.location.href = "/login";

            }, 1200);
        }
        catch (error) {
            console.error("Registration Error: ", error);
            registerMessage.textContent = "Unable to connect to Server";
            registerMessage.className = "Register-Message Error";
            registerButton.disabled = false;
            registerButton.classList.remove("Loading");
        }


    });

    document.addEventListener("DOMContentLoaded", () => {

        const footerLinks =
            document.querySelectorAll(".footer-links a");


        footerLinks.forEach((link) => {

            link.addEventListener("click", (event) => {

                const target =
                    link.getAttribute("href");


                // If the page does not exist yet
                if (!target || target === "#") {

                    event.preventDefault();

                    showFooterMessage(
                        `${link.textContent.trim()} page is coming soon.`
                    );

                }

            });

        });


        /* =========================================
           FOOTER MESSAGE
        ========================================== */

        function showFooterMessage(message) {

            let toast =
                document.getElementById("footerToast");


            // Create toast if it doesn't exist
            if (!toast) {

                toast = document.createElement("div");

                toast.id = "footerToast";

                toast.className = "footer-toast";

                document.body.appendChild(toast);

            }


            toast.textContent = message;

            toast.classList.add("show");


            setTimeout(() => {

                toast.classList.remove("show");

            }, 2500);

        };
    });
});