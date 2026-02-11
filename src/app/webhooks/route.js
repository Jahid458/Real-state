import { verifyWebhook } from "@clerk/nextjs/webhooks";

export async function POST(req) {
  try {
    // Clerk verifyWebhook expects the raw request
    const evt = await verifyWebhook(req);

    const { id } = evt.data;
    const eventType = evt.type;

    console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
    console.log("Webhook payload:", evt.data);

    // Example: handle user.created event
    if (eventType === "user.created") {
      // Add your DB logic here
      console.log("New user created with ID:", id);
    }
    if (eventType === "user.updated") {
      // Add your DB logic here
      console.log("New user updated with ID:", id);
    }
    if (eventType === "user.deleted") {
      // Add your DB logic here
      console.log("New user deleted with ID:", id);
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
