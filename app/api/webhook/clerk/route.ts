import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createUser, deleteUser, updateUser } from '@/lib/actions/user.actions'
import { NextResponse } from 'next/server'
 
export async function POST(req: Request) {
  try {
    // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET
 
    if (!WEBHOOK_SECRET) {
      throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
    }
 
    // Get the headers
    const headersList = headers();
    const svix_id = headersList.get("svix-id") ?? '';
    const svix_timestamp = headersList.get("svix-timestamp") ?? '';
    const svix_signature = headersList.get("svix-signature") ?? '';
 
    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
    }
 
    // Get the body
    const payload = await req.json()
    const body = JSON.stringify(payload);
 
    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);
 
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
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
 
    // Get the ID and type
    const { id } = evt.data;
    const eventType = evt.type;
 
    if(eventType === 'user.created') {
      const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;

      const user = {
        clerkId: id,
        email: email_addresses?.[0]?.email_address || '',
        username: username || '',
        firstName: first_name || '',
        lastName: last_name || '',
        photo: image_url || '',
      }

      const newUser = await createUser(user);
      
      if (!newUser) {
        throw new Error('Failed to create user in MongoDB');
      }

      return NextResponse.json({ message: 'User created successfully', user: newUser });
    }

    if (eventType === 'user.updated') {
      const { id, image_url, first_name, last_name, username } = evt.data;

      const user = {
        firstName: first_name || '',
        lastName: last_name || '',
        username: username || '',
        photo: image_url || '',
      }

      const updatedUser = await updateUser(id, user);
      
      if (!updatedUser) {
        throw new Error('Failed to update user in MongoDB');
      }

      return NextResponse.json({ message: 'User updated successfully', user: updatedUser });
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data;

      const deletedUser = await deleteUser(id!);
      
      if (!deletedUser) {
        throw new Error('Failed to delete user in MongoDB');
      }

      return NextResponse.json({ message: 'User deleted successfully', user: deletedUser });
    }

    console.log('Unhandled webhook event type:', eventType);
    return NextResponse.json({ message: 'Webhook received but not handled' });

  } catch (error) {
    console.error('Error in webhook:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
 