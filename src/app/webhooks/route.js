import { Webhook } from "svix";
import { headers } from "next/headers";

export async function POST(req) {
  const SINGING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!SINGING_SECRET) {
    throw new Error("Err please Add to SINGIng SEcret from clerk Dashboard");
  }

  const wh = new Webhook(SINGING_SECRET);

  const headerPayLoad = await headers();
  const sivix_id = headerPayLoad.get("svix-id");
  const svix_timestamp = headerPayLoad.get("svix-timestamp");
  const svix_signiture = headerPayLoad.get("svix-signiture");

  if (!sivix_id || !svix_timestamp || !svix_signiture) {
    return new Response("Error: Missing Svix Headers", {
      status: 400,
    });
  }

  // get Body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt;
  try {
    evt = wh.verify(body, {
      "svix-id": sivix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signiture,
    });
  } catch (err) {
    console.log("Error: Couldnot verify webhook :", err);
    return new Response("Error: Verification Error", {
      status: 400,
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  if (evt.type === "user.created") {
    console.log(`user.created`);
  }
  if (evt.type === "user.updated") {
    console.log(`user.updated`);
  }
  if (evt.type === "user.deleted") {
    console.log(`user.deleted`);
  }

  return new Response("Webhook Recieved", { status: 200 });
}
