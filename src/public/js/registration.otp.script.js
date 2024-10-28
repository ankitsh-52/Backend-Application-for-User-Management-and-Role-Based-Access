document.addEventListener("DOMContentLoaded", () => {
    const sendOtpBtn = document.getElementById("send-otp");
    const otpField = document.getElementById("otp-field");
    const registerBtn = document.getElementById("register-btn");
    const verifyOtpBtn = document.getElementById("verify-otp");

    sendOtpBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const email = document.querySelector("input[name = 'email']").value;
        console.log("email is : ", email);
        
        if(! email){
            alert("Please enter a valid email address.");
            return;
        }

        try {
            const response = await axios.get(`/sendOtp?email=${encodeURIComponent(email)}`);
            console.log(response);  // Log full response

            if (response.status == 200) {
                alert("OTP sent successfully");
                otpField.style.display = "block";  // Show OTP field
                verifyOtpBtn.style.display = "block";
            } else {
                alert("Error sending OTP, please try again.");
            }
        } catch (error) {
            console.error("Error sending OTP:", error);  // Log any error
        }
    })

    verifyOtpBtn.addEventListener("click", async(e) => {
        e.preventDefault();

        let otp = document.querySelector("input[name = 'otp']").value;

        if(!otp){
            alert('Please enter valid otp');
            return;
        }

        try {
            const resp = await axios.post("/verifyOtp", {otp})
            console.log("Verify Otp Btn resp: ", resp);
            if (resp.status == 200) {
                alert("OTP verified successfully");
                 // Enable Register button
                registerBtn.disabled = false;
            } else {
                alert("Error sending OTP, please try again.");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
        }
    })
})