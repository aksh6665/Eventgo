"use server"

import { connectToDatabase } from "@/lib/database"
import Event from "@/lib/database/models/event.model"
import { handleError } from "@/lib/utils"
import User from "@/lib/database/models/user.model"
import { CreateEventParams, UpdateEventParams, DeleteEventParams, GetAllEventsParams, GetEventsByUserParams } from "@/types"
import Category from "@/lib/database/models/category.model"

export async function getAllEvents({ query, limit = 6, page, category }: GetAllEventsParams) {
  try {
    await connectToDatabase()

    const conditions: any = {}

    if (query) {
      conditions.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ]
    }

    if (category && category !== 'all') {
      conditions.category = category
    }

    const skipAmount = (Number(page) - 1) * limit

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)
      .populate({ path: 'organizer', model: 'User', select: '_id firstName lastName' })
      .populate({ path: 'category', model: 'Category', select: '_id name' })

    const events = await eventsQuery.exec()
    const totalEvents = await Event.countDocuments(conditions)

    // Ensure proper serialization of dates and ObjectIds
    const serializedEvents = events.map(event => ({
      ...event.toObject(),
      _id: event._id.toString(),
      createdAt: event.createdAt.toISOString(),
      startDateTime: event.startDateTime.toISOString(),
      endDateTime: event.endDateTime.toISOString(),
      organizer: event.organizer ? {
        ...event.organizer.toObject(),
        _id: event.organizer._id.toString()
      } : null,
      category: event.category ? {
        ...event.category.toObject(),
        _id: event.category._id.toString()
      } : null
    }))

    return {
      data: serializedEvents,
      totalPages: Math.ceil(totalEvents / limit),
    }
  } catch (error) {
    console.error('Error in getAllEvents:', error)
    return {
      data: [],
      totalPages: 0,
    }
  }
}

export async function getEventsByUser({ userId, limit = 6, page }: GetEventsByUserParams) {
  try {
    await connectToDatabase()

    const conditions = { organizer: userId }
    const skipAmount = (Number(page) - 1) * limit

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)
      .populate({ path: 'organizer', model: 'User', select: '_id firstName lastName' })
      .populate({ path: 'category', model: 'Category', select: '_id name' })

    const events = await eventsQuery.exec()
    const totalEvents = await Event.countDocuments(conditions)

    const serializedEvents = events.map(event => ({
      ...event.toObject(),
      _id: event._id.toString(),
      createdAt: event.createdAt.toISOString(),
      startDateTime: event.startDateTime.toISOString(),
      endDateTime: event.endDateTime.toISOString(),
      organizer: event.organizer ? {
        ...event.organizer.toObject(),
        _id: event.organizer._id.toString()
      } : null,
      category: event.category ? {
        ...event.category.toObject(),
        _id: event.category._id.toString()
      } : null
    }))

    return {
      data: serializedEvents,
      totalPages: Math.ceil(totalEvents / limit),
    }
  } catch (error) {
    console.error('Error in getEventsByUser:', error)
    return {
      data: [],
      totalPages: 0,
    }
  }
}

export async function createEvent({ userId, event, path }: CreateEventParams) {
  try {
    await connectToDatabase()

    // First, ensure the user exists in MongoDB
    let mongoUser = await User.findOne({ clerkId: userId })
    
    if (!mongoUser) {
      // If user doesn't exist, sync with Clerk
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/user/sync`)
      const data = await response.json()
      
      if (data.error) {
        throw new Error('Failed to sync user data')
      }
      
      mongoUser = data.user
    }

    if (!mongoUser) {
      throw new Error('User not found')
    }

    const { categoryId, ...eventData } = event
    
    const newEvent = await Event.create({
      ...eventData,
      category: categoryId,
      organizer: mongoUser._id,
    })

    const populatedEvent = await Event.findById(newEvent._id)
      .populate({ 
        path: 'organizer', 
        model: User,
        select: '_id firstName lastName'
      })
      .populate({ 
        path: 'category', 
        model: Category,
        select: '_id name'
      })

    if (!populatedEvent) {
      throw new Error('Failed to create event')
    }

    // Ensure the event has all required fields before serializing
    const serializedEvent = {
      ...populatedEvent.toObject(),
      _id: populatedEvent._id.toString(),
      createdAt: populatedEvent.createdAt.toISOString(),
      startDateTime: populatedEvent.startDateTime.toISOString(),
      endDateTime: populatedEvent.endDateTime.toISOString(),
      organizer: populatedEvent.organizer ? {
        _id: populatedEvent.organizer._id.toString(),
        firstName: populatedEvent.organizer.firstName || '',
        lastName: populatedEvent.organizer.lastName || ''
      } : null,
      category: populatedEvent.category ? {
        _id: populatedEvent.category._id.toString(),
        name: populatedEvent.category.name
      } : null
    }

    return serializedEvent
  } catch (error) {
    console.error('Error creating event:', error)
    handleError(error)
  }
}

export async function updateEvent({ userId, event, path }: UpdateEventParams) {
  try {
    await connectToDatabase()

    // Get the MongoDB user using the Clerk ID
    const mongoUser = await User.findOne({ clerkId: userId })
    if (!mongoUser) {
      throw new Error('User not found')
    }

    const eventToUpdate = await Event.findById(event._id)
      .populate('organizer')

    if (!eventToUpdate || eventToUpdate.organizer._id.toString() !== mongoUser._id.toString()) {
      throw new Error('Unauthorized or event not found')
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { ...event, category: event.categoryId },
      { new: true }
    )
    .populate({ path: 'organizer', model: 'User', select: '_id firstName lastName' })
    .populate({ path: 'category', model: 'Category', select: '_id name' })

    if (!updatedEvent) {
      throw new Error('Failed to update event')
    }

    return JSON.parse(JSON.stringify(updatedEvent))
  } catch (error) {
    handleError(error)
  }
}

export async function getEventById(eventId: string) {
  try {
    await connectToDatabase()

    const event = await Event.findById(eventId)
      .populate({ path: 'organizer', model: 'User', select: '_id firstName lastName' })
      .populate({ path: 'category', model: 'Category', select: '_id name' })

    if (!event) {
      throw new Error('Event not found')
    }

    return JSON.parse(JSON.stringify(event))
  } catch (error) {
    handleError(error)
  }
}

export async function getRelatedEventsByCategory({
  categoryId,
  eventId,
  limit = 3,
  page = 1,
}: {
  categoryId: string
  eventId: string
  limit?: number
  page?: number
}) {
  try {
    await connectToDatabase()

    const skipAmount = (Number(page) - 1) * limit
    const conditions = { $and: [{ category: categoryId }, { _id: { $ne: eventId } }] }

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)
      .populate({ path: 'organizer', model: 'User', select: '_id firstName lastName' })
      .populate({ path: 'category', model: 'Category', select: '_id name' })

    const events = await eventsQuery.exec()
    const totalEvents = await Event.countDocuments(conditions)

    const serializedEvents = events.map(event => ({
      ...event.toObject(),
      _id: event._id.toString(),
      createdAt: event.createdAt.toISOString(),
      startDateTime: event.startDateTime.toISOString(),
      endDateTime: event.endDateTime.toISOString(),
      organizer: event.organizer ? {
        ...event.organizer.toObject(),
        _id: event.organizer._id.toString()
      } : null,
      category: event.category ? {
        ...event.category.toObject(),
        _id: event.category._id.toString()
      } : null
    }))

    return {
      data: serializedEvents,
      totalPages: Math.ceil(totalEvents / limit),
    }
  } catch (error) {
    handleError(error)
  }
}

export async function deleteEvent({ eventId, path }: DeleteEventParams) {
  try {
    await connectToDatabase()

    // First check if the event exists
    const event = await Event.findById(eventId)
    if (!event) {
      throw new Error('Event not found')
    }

    // Delete the event
    const deletedEvent = await Event.findByIdAndDelete(eventId)
    if (!deletedEvent) {
      throw new Error('Failed to delete event')
    }

    // Return the deleted event data
    return {
      success: true,
      data: JSON.parse(JSON.stringify(deletedEvent))
    }
  } catch (error) {
    // Proper error handling with detailed message
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    console.error('Error in deleteEvent:', errorMessage)
    return {
      success: false,
      error: errorMessage
    }
  }
} 