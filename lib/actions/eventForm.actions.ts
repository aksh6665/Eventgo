"use server"

import { createEvent, updateEvent } from "./event.actions"
import { z } from "zod"
import { eventFormSchema } from "@/lib/validator"

export async function handleEventFormSubmit(
  values: z.infer<typeof eventFormSchema>,
  userId: string,
  type: "Create" | "Update",
  eventId?: string,
  uploadedImageUrl?: string
) {
  if(type === 'Create') {
    try {
      const newEvent = await createEvent({
        event: { ...values, imageUrl: uploadedImageUrl || values.imageUrl },
        userId,
        path: '/profile'
      })

      return newEvent
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  if(type === 'Update') {
    if(!eventId) {
      throw new Error('Event ID is required for update')
    }

    try {
      const updatedEvent = await updateEvent({
        userId,
        event: { ...values, imageUrl: uploadedImageUrl || values.imageUrl, _id: eventId },
        path: `/events/${eventId}`
      })

      return updatedEvent
    } catch (error) {
      console.error(error)
      throw error
    }
  }
} 