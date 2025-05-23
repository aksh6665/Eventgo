import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createUser, updateUser, deleteUser } from '@/lib/actions/user.actions'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;

    const user = await createUser({
      clerkId: id,
      email: email_addresses[0].email_address,
      username: username || '',
      firstName: first_name || '',
      lastName: last_name || '',
      photo: image_url || '',
    })

    return NextResponse.json({ message: 'User created', user })
  }

  if (eventType === 'user.updated') {
    const { id, image_url, first_name, last_name, username } = evt.data;

    const user = await updateUser(id, {
      username: username || '',
      firstName: first_name || '',
      lastName: last_name || '',
      photo: image_url || '',
    })

    return NextResponse.json({ message: 'User updated', user })
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    const user = await deleteUser(id)

    return NextResponse.json({ message: 'User deleted', user })
  }

  return NextResponse.json({ message: 'Webhook received' })
} 