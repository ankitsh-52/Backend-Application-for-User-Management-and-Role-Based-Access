// function sendOtp() {
//     const emailInput = document.getElementById('email');
//     const email = emailInput.value.trim();

//     // Frontend validation for email field
//     if (email === '') {
//         emailInput.classList.add('is-invalid'); // Adds Bootstrap error styling
//     } else {
//         emailInput.classList.remove('is-invalid'); // Removes error styling if valid
//         // Assuming OTP is sent successfully, hide the email section
//         document.getElementById('email-section').style.display = 'none';
//         // Show the OTP section
//         document.getElementById('otp-section').style.display = 'block';
//         alert("OTP has been sent to " + email);
//     }
// }

// Function to verify OTP (for demo purposes)
// function verifyOtp() {
//     const otp = document.getElementById('otp').value;

//     if (otp) {
//         alert("OTP verified successfully!");
//         // Add more handling code for successful OTP verification here
//     } else {
//         alert("Please enter the OTP sent to your email.");
//     }
// }

// Function to reset the form
// function resetForm() {
//     // Clear all input fields and reset visibility
//     document.getElementById('email').value = '';
//     document.getElementById('otp').value = '';
//     document.getElementById('email').classList.remove('is-invalid'); // Removes error styling
//     document.getElementById('email-section').style.display = 'block';
//     document.getElementById('otp-section').style.display = 'none';
// }


document.addEventListener("DOMContentLoaded", () => {
    console.log("############");
    
    const sendOtpBtn = document.getElementById("send-otp");
    const verifyOtpBtn = document.getElementById("verify-otp");
    const emailSection = document.getElementById("email-section");
    const otpSection = document.getElementById("otp-section");

    sendOtpBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@");
        

        const email = document.querySelector("input[name = 'email']").value.trim();
        console.log("Email from pwd forget: ", email);

        if (!email) {
            alert("Please enter a valid email address");
            return;
        }

        try {
            const resp = await axios.get(`/sendOtp?email=${encodeURIComponent(email)}`);
            console.log("email otp resp from pwd reset", resp);

            if (resp.status == 200) {
                // alert("Otp sent successfully");
                alert("OTP has been sent to " + email);
                otpSection.style.display = "block";
                emailSection.style.display = "none";
            } else {
                alert("Error sending OTP, please try again");
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
        }
    });

    verifyOtpBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        let otp = document.querySelector("input[name = 'otp']").value.trim();

        if(!otp) {
            alert("Please enter a valid email address");
            return;
        }

        try {
            let resp = await axios.post(`/verifyOtp`, {otp})
            console.log("Otp verified in pwd forget section", resp);

            if(resp.status == 200){
                alert("Otp verified successfully");
            }
        } catch (error) {
            
        }
    })
});