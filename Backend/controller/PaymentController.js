import Razorpay from "razorpay";
import crypto from "crypto";
import Intern from "../model/internSchema.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


export const purchasePlan = async (req, res) => {
  try {
    const internId = req.user.id; 
    const { planId, planCategory, amount, credits } = req.body;

    if (!planId || !planCategory || !amount || !credits) {
      return res
        .status(400)
        .json({ success: false, message: "Plan details are missing" });
    }

    // Razorpay needs amount in paise
    const amountInPaise = amount * 100;

    // keep receipt length < 40 chars
    const shortInternId = internId.toString().slice(-6);
    const receiptId = `rcpt_${shortInternId}_${Date.now()}`; // ~25 chars

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: receiptId,
      notes: {
        internId,
        planId,
        planCategory,
        credits,
      },
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error creating Razorpay order" });
  }
};


export const verifyPayment = async (req, res) => {
  try {
    const internId = req.user.id;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
      planCategory,
      amount,
      credits,
    } = req.body;

    // 1️⃣ Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }

    // 2️⃣ Find intern
    const intern = await Intern.findById(internId);
    if (!intern) {
      return res
        .status(404)
        .json({ success: false, message: "Intern not found" });
    }

    // 3️⃣ Update credits & plan (one-time purchase logic)
    const creditsToAdd = Number(credits) || 0;
    const amountNumber = Number(amount) || 0;

    intern.jobCredits = (intern.jobCredits || 0) + creditsToAdd;
    intern.planCategory = planCategory || intern.planCategory || "NONE";

    intern.paymentHistory.push({
      amount: amountNumber,
      currency: "INR",
      paymentId: razorpay_payment_id,
      status: "success",
      planPurchased: planCategory,
    });

    await intern.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified and plan activated",
      jobCredits: intern.jobCredits,
      planCategory: intern.planCategory,
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error verifying payment" });
  }
};

//get current plan
export const getCurrentPlan = async (req, res) => {
  try {
    const internId = req.user.id;
    const intern = await Intern.findById(internId);
    if (!intern) {
      return res
        .status(404)
        .json({ success: false, message: "Intern not found" });
    }
    return res.status(200).json({
      success: true,
      planCategory: intern.planCategory,
      jobCredits: intern.jobCredits,
    });
  } catch (error) {
    console.error("Get Current Plan Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching current plan",
    });
  }
};

//get payment history
export const getPaymentHistory = async (req, res) => {
  try {
    const internId = req.user.id;
    const intern = await Intern.findById(internId);
    if (!intern) {
      return res.status(404).json({ success: false, message: "Intern not found" });
    }
    return res.status(200).json({
      success: true,
      paymentHistory: intern.paymentHistory || [],
    });
  } catch (error) {
    console.error("Get Payment History Error:", error);
    return res.status(500).json({ success: false, message: "Error fetching payment history" });
    }
};
