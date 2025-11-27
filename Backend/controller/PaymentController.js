import Razorpay from "razorpay";
import crypto from "crypto";
import Intern from "../model/internSchema.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * 🧾 Create Order (Backend)
 * Body: { planType }  // "BASIC" or "PREMIUM"
 */
export const createOrder = async (req, res) => {
  try {
    const internId = req.user.id; // from auth middleware
    const { planType } = req.body;

    // Decide price based on planType
    let amount;
    if (planType === "BASIC") amount = 19900;      // ₹199.00
    else if (planType === "PREMIUM") amount = 49900; // ₹499.00
    else return res.status(400).json({ message: "Invalid plan type" });

    const options = {
      amount, // in paise
      currency: "INR",
      receipt: `receipt_${internId}_${Date.now()}`,
      notes: {
        internId,
        planType,
      },
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      planType,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Error creating Razorpay order" });
  }
};

/**
 * ✅ Verify Payment (Backend)
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, planType }
 */
export const verifyPayment = async (req, res) => {
  try {
    const internId = req.user.id;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planType,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Payment verified ✅
    const intern = await Intern.findById(internId);
    if (!intern) return res.status(404).json({ message: "Intern not found" });

    // Set plan expiry (e.g. 30 days)
    const now = new Date();
    const planExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    intern.isPaid = true;
    intern.planType = planType;
    intern.planExpiry = planExpiry;

    intern.paymentHistory.push({
      amount: planType === "BASIC" ? 199 : 499,
      currency: "INR",
      paymentId: razorpay_payment_id,
      status: "success",
    });

    await intern.save();

    res.status(200).json({
      success: true,
      message: "Payment verified and plan activated",
      planType: intern.planType,
      planExpiry: intern.planExpiry,
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({ message: "Error verifying payment" });
  }
};
