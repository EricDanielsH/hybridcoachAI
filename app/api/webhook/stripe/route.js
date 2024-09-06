import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/lib/models/user";
import { plans } from "@/components/Pricing";
import jwt from "jsonwebtoken";

const secret = process.env.AUTH_SECRET; // Your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const body = await req.text();

  const signature = headers().get("stripe-signature");

  let data;
  let eventType;
  let event;

  // verify Stripe event is legit
  try {
    // Connect to MongoDB
    await connectMongoDB();

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed. ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  data = event.data;
  eventType = event.type;

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        // First payment is successful and a subscription is created (if mode was set to "subscription" in ButtonCheckout)
        // ✅ Grant access to the product

        // Retrieve session details
        const session = await stripe.checkout.sessions.retrieve(
          data.object.id,
          {
            expand: ["line_items"],
          },
        );
        console.log("Stripe session", session);

        // Check if the customer exists
        let customerId = session?.customer;
        let customer = null;

        if (customerId) {
          // Only retrieve customer if a customerId exists (for subscriptions or saved customer that is returning to pay again)
          customer = await stripe.customers.retrieve(customerId);
        }

        if (!customer) {
          // Handle cases where the customer is null (e.g., for one-time payments with no saved customer)
          console.log(
            "No customer found in session, processing as a guest or one-time payment",
          );
          // Check for customer details from session and create a new Stripe customer
          const customerEmail = session?.customer_details?.email;

          if (customerEmail) {
            // Create a new Stripe customer if not already present
            console.log(
              "Creating new Stripe customer with email",
              customerEmail,
            );
            customer = await stripe.customers.create({
              email: customerEmail,
              name: session?.customer_details?.name,
              address: session?.customer_details?.address,
              metadata: {
                userId: "",
              },
            });
            customerId = customer.id; // Update customerId with the newly created Stripe customer ID
            console.log(`New Stripe customer created with ID: ${customerId}`);
            console.log("Customer details", customer);
          } else {
            console.error("No customer email found in session");
            throw new Error("No customer email found");
          }
        }

        // Retrieve the priceId from the session
        const priceId = session?.line_items?.data[0]?.price.id;
        // Find the plan from plans imported array
        const plan = plans.find((p) => p.priceId === priceId);

        if (!plan) {
          console.error("No matching plan found for price ID");
          break;
        }

        // Identify user by email from customer details
        const customerEmail =
          customer?.email || session?.customer_details?.email;
        let user;

        if (customerEmail) {
          // Look for an existing user in your database by email
          user = await User.findOne({ email: customerEmail });

          if (!user) {
            console.error("No user found with email", customerEmail);
            break;
          }

          // Update user data + grant access to the product
          user.priceId = priceId;
          user.customerId = customerId;
          user.hasAccess = true;
          await user.save();

          // Update customer metadata with user ID
          customer.metadata.userId = user._id.toString();
          // Create a new token with updated access
          const newToken = jwt.sign(
            {
              user: {
                name: user.name,
                email: user.email,
                id: user._id,
                hasAccess: true, // Updated access state
              },
              expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiration
            },
            secret,
          );

          // Send new token back to the user (e.g., set a cookie or return it in the response)
          res.setHeader("Set-Cookie", `token=${newToken}; HttpOnly; Path=/`);

          console.log("Token updated and sent back.");
        } else {
          console.error("No customer email found");
          throw new Error("No customer email found");
        }

        // Optionally, send email notification to the user or admin dashboard here
        break;
      }

      case "customer.subscription.deleted": {
        // ❌ Revoke access to the product
        // The customer might have changed the plan (higher or lower plan, cancel soon etc...)
        const subscription = await stripe.subscriptions.retrieve(
          data.object.id,
        );
        const user = await User.findOne({
          customerId: subscription.customer,
        });

        // Revoke access to your product
        user.hasAccess = false;
        await user.save();

        break;
      }

      // case "checkout.session.expired": {
      // }

      // case "customer.subscription.updated": {
      // }

      // case "invoice.paid": {
      // }

      // case "invoice.payment_failed": {
      // }

      default:
      // Unhandled event type
    }
  } catch (e) {
    console.error("stripe error: " + e.message + " | EVENT TYPE: " + eventType);
  }

  return NextResponse.json({});
}
