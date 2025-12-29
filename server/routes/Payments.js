// Import the required modules
const express = require("express")
const router = express.Router()

const { capturePayment, verifyPayment, sendPaymentSuccessEmail } = require("../controllers/Payment")
const { auth, isInstructor, isStudent, isAdmin } = require("../middleware/auth")
router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verifyPayment",auth, isStudent, verifyPayment)
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);


router.get("/razorpay-key", (req, res) => {
    return res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID, // <-- backend env var
    });
    // console.log(key)
  });

module.exports = router
