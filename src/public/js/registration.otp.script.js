document.addEventListener("DOMContentLoaded", () => {
    const sendOtpBtn = document.getElementById("send-otp");

    sendOtpBtn.addEventListener("click", async (e) => 
    {
        e.preventDefault(); 
        const email = document.querySelector("input[name='email']").value;
        if (!email) {
            alert("Please enter a valid email address.");
            return;
        }

        const formData = new FormData(document.querySelector("#form1"));
            // Save form data in sessionStorage
        for (const [key, value] of formData.entries()) {
            sessionStorage.setItem(key, value);
        }

        try {
            const response = await axios.get('/send-otp');
            if (response.status === 200) {
                alert(`OTP sent successfully`);
                // No alert here to avoid interrupting the flow
                console.log("###########");
                window.location.href = "/otp";  // Redirect to the OTP entry page
            }
        } 
        catch (error) {
            console.error("Error sending OTP:", error);
        }
    });
});