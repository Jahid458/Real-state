import { Webhook } from "svix";
import { headers } from "next/headers";
import { createOrUpdateUser, DeleteUser } from "@/lib/actions/user";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error("Error: Please add SIGNING_SECRET from Clerk Dashboard");
  }

  const wh = new Webhook(SIGNING_SECRET);
  const headerPayload = await headers();

  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix Headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.log("Error: Could not verify webhook:", err);
    return new Response("Error: Verification Error", {
      status: 400,
    });
  }

  const { id } = evt?.data;
  const eventType = evt?.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const { first_name, last_name, image_url, email_addresses } = evt?.data;

    try {
      const user = await createOrUpdateUser(
        id,
        first_name,
        last_name,
        image_url,
        email_addresses,
      );

      if (user && eventType === "user.created") {
        try {
          await clerkClient.users.updateUserMetadata(id, {
            // ✅ Fixed: users (plural)
            publicMetadata: {
              userMongoId: user._id,
            },
          });
        } catch (error) {
          console.log("Error updating metadata:", error);
        }
      }

      return new Response("User processed successfully", { status: 200 });
    } catch (error) {
      console.log("Error could not update or create user:", error);
      return new Response("Could not update or create User", { status: 400 });
    }
  }

  if (eventType === "user.deleted") {
    try {
      await DeleteUser(id);
    } catch (error) {
      console.log("Error handling user.deleted event:", error);
      return new Response("Couldnot Delete User", { status: 400 });
    }
  }
  return new Response("Webhook Received", { status: 200 });
}
