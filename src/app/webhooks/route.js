// app/api/webhook/route.js
import { verifyWebhook } from "@clerk/nextjs/webhooks";

export const runtime = "nodejs"; // Use Node runtime to see console.log in terminal

export async function POST(req) {
  try {
    // 1️⃣ Get raw body as text (important for signature verification)
    const body = await req.text();

    // 2️⃣ Get the Clerk webhook signature from headers
    const signature = req.headers.get("x-clerk-signature");
    if (!signature) {
      throw new Error("Missing x-clerk-signature header");
    }

    // 3️⃣ Verify webhook using raw body + signature
    const evt = await verifyWebhook(body, signature);

    // 4️⃣ Extract ID and event type
    const { id } = evt.data;
    const eventType = evt.type;

    // 5️⃣ Console logs for debugging
    console.log(`Webhook received: ID=${id}, type=${eventType}`);
    console.log("Full payload:", evt.data);

    // 6️⃣ Handle different events
    switch (eventType) {
      case "user.created":
        console.log("New user created with ID:", id);
        break;
      case "user.updated":
        console.log("User updated with ID:", id);
        break;
      case "user.deleted":
        console.log("User deleted with ID:", id);
        break;
      default:
        console.log("Unhandled event type:", eventType);
    }

    // 7️⃣ Return success response
    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
