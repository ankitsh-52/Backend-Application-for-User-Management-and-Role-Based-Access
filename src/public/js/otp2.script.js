document.addEventListener("DOMContentLoaded", () => {

    const inputs = document.querySelectorAll(".otp-input");
    const button = document.querySelector("#verify-otp");

    // Check if the elements exist before proceeding
    if (!inputs || inputs.length === 0 || !button) {
        console.error("OTP inputs or verify button not found.");
        return;
    }

    // Iterate over all inputs
    inputs.forEach((input, index1) => {
        input.addEventListener("keyup", (e) => {
            const currentInput = input;
            const nextInput = input.nextElementSibling;
            const prevInput = input.previousElementSibling;

            if (currentInput.value.length > 1) {
                currentInput.value = "";
                return;
            }

            // Enable the next input if current input has a value
            if (nextInput && nextInput.tagName === "INPUT" && nextInput.hasAttribute("disabled") && currentInput.value !== "") {
                nextInput.removeAttribute("disabled");
                nextInput.focus();
            }

            // Handle backspace
            if (e.key === "Backspace") {
                inputs.forEach((input, index2) => {
                    if (index1 <= index2 && prevInput && prevInput.tagName === "INPUT") {
                        input.setAttribute("disabled", true);
                        input.value = "";
                        prevInput.focus();
                    }
                });
            }

            // Enable the verify button if all inputs are filled
            if (!inputs[5].disabled && inputs[5].value !== "") {
                button.classList.add("active");
                return;
            }
            button.classList.remove("active");
        });
    });

    // Focus on the first input on page load
    window.addEventListener("load", () => inputs[0]?.focus());

    const saveUserData = () => {
        const userData = {
            name: document.querySelector("#name").value, // Assuming there's an input field with id="name"
            email: document.querySelector("#email").value // Assuming there's an input field with id="email"
        };
        // Save the data to localStorage
        localStorage.setItem("userData", JSON.stringify(userData));
    };

    // Verify OTP on button click
    button.addEventListener("click", async (e) => {
        e.preventDefault();  // Prevent default form submission

        // Gather the OTP from the inputs
        const otpValues = Array.from(inputs).map(input => input.value).join("");

        if (otpValues.length !== 6) {
            alert("Please enter a valid 6-digit OTP");
            return;
        }

        saveUserData();

        try {
            const response = await axios.post('/otp', { userOtp: otpValues });
            if (response.status === 200)  {
                alert("OTP verified successfully");
                window.location.href = `/register`;
            } else {
                // Handle the case where OTP is incorrect or verification failed
                alert(response.data.message || "Invalid OTP. Please try again.");
            }
        } catch (error) {
            alert("Invalid OTP. Please try again.");
            // console.error("Error verifying OTP:", error);
        }
    });
});
