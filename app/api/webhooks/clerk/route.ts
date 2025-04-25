import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

export async function POST(req: Request) {
  // Get the webhook signature from the headers
  const headerPayload = headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");
  
  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new NextResponse("Error: Missing svix headers", { status: 400 });
  }
  
  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);
  
  // Verification
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new NextResponse("Error: Missing webhook secret", { status: 500 });
  }
  
  // Create the webhook event
  let event: WebhookEvent;
  
  try {
    const webhook = new Webhook(webhookSecret);
    event = webhook.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new NextResponse("Error verifying webhook", { status: 400 });
  }
  
  // Handle the webhook event
  try {
    switch (event.type) {
      case "user.created":
        // Handle user creation
        await handleUserCreated(event.data);
        break;
      case "user.updated":
        // Handle user update
        await handleUserUpdated(event.data);
        break;
      case "session.created":
        // Handle session creation
        await handleSessionCreated(event.data);
        break;
      case "session.revoked":
        // Handle session revocation
        await handleSessionRevoked(event.data);
        break;
      // Add more event types as needed
      default:
        console.log(`Unhandled webhook event: ${event.type}`);
    }
    
    return new NextResponse(`Webhook processed for event: ${event.type}`, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new NextResponse("Error processing webhook", { status: 500 });
  }
}

// Handler functions
async function handleUserCreated(data: any) {
  // Implement user creation logic
  console.log("User created:", data.id);
  
  // Example: Create user in your database
  // await db.user.create({
  //   id: data.id,
  //   email: data.email_addresses[0]?.email_address,
  //   firstName: data.first_name,
  //   lastName: data.last_name,
  // });
}

async function handleUserUpdated(data: any) {
  // Implement user update logic
  console.log("User updated:", data.id);
  
  // Example: Update user in your database
  // await db.user.update({
  //   where: { id: data.id },
  //   data: {
  //     email: data.email_addresses[0]?.email_address,
  //     firstName: data.first_name,
  //     lastName: data.last_name,
  //   },
  // });
}

async function handleSessionCreated(data: any) {
  // Implement session creation logic
  console.log("Session created:", data.id);
  
  // Example: Log session activity
  // await db.activity.create({
  //   userId: data.user_id,
  //   action: "session_created",
  //   metadata: { sessionId: data.id },
  // });
}

async function handleSessionRevoked(data: any) {
  // Implement session revocation logic
  console.log("Session revoked:", data.id);
  
  // Example: Log session revocation
  // await db.activity.create({
  //   userId: data.user_id,
  //   action: "session_revoked",
  //   metadata: { sessionId: data.id },
  // });
}
