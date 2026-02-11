// app/api/webhook/route.js
import { verifyWebhook } from "@clerk/nextjs/webhooks";

export const runtime = "nodejs"; // Make sure console.log works

export async function POST(req) {
  try {
    // Get raw body as text
    const body = await req.text();

    // Get Clerk signature from headers
    const signature = req.headers.get("x-clerk-signature");

    // Verify webhook
    const evt = await verifyWebhook(body, signature);

    const { id } = evt.data;
    const eventType = evt.type;

    console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
    console.log("Webhook payload:", evt.data);

    // Handle events
    if (eventType === "user.created") {
      console.log("New user created with ID:", id);
    }
    if (eventType === "user.updated") {
      console.log("User updated with ID:", id);
    }
    if (eventType === "user.deleted") {
      console.log("User deleted with ID:", id);
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
