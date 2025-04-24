import { connectToDatabase } from "@/lib/database"
import Event from "@/lib/database/models/event.model"
import { handleError } from "@/lib/utils"

type GetAllEventsParams = {
  query: string
  category: string
  page: number
  limit: number
}

export async function getAllEvents({ query, category, page, limit = 6 }: GetAllEventsParams) {
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
      organizer: {
        ...event.organizer.toObject(),
        _id: event.organizer._id.toString()
      },
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