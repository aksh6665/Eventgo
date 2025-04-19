import { Event } from "@/types"
import Link from "next/link"
import Image from "next/image"
import { formatDateTime } from "@/lib/utils"

type CollectionProps = {
  data: Event[]
  emptyTitle: string
  emptyStateSubtext: string
  collectionType?: 'All_Events' | 'My_Tickets' | 'Events_Organized'
  limit: number
  page: number | string
  totalPages?: number
}

const Collection = ({
  data,
  emptyTitle,
  emptyStateSubtext,
  collectionType,
  page,
  totalPages = 0,
}: CollectionProps) => {
  return (
    <>
      {data.length > 0 ? (
        <div className="flex flex-col items-center gap-10">
          <ul className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
            {data.map((event) => {
              return (
                <li key={event._id} className="flex min-h-[380px] w-full flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
                  <Link href={`/events/${event._id}`} className="flex h-full flex-col gap-5">
                    <Image 
                      src={event.imageUrl}
                      alt={event.title}
                      width={500}
                      height={400}
                      className="h-full min-h-[300px] object-cover object-center"
                    />

                    <div className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4">
                      <div className="flex gap-2">
                        <span className="p-semibold-14 w-min rounded-full bg-grey-500/10 px-4 py-1 text-grey-500">
                          {event.category.name}
                        </span>
                        <p className="p-semibold-14 w-min rounded-full bg-grey-500/10 px-4 py-1 text-grey-500">
                          {event.isFree ? 'FREE' : `$${event.price}`}
                        </p>
                      </div>

                      <p className="p-medium-16 md:p-medium-18 line-clamp-2 flex-1 text-black">
                        {event.title}
                      </p>

                      <div className="flex-between w-full">
                        <p className="p-medium-14 md:p-medium-16 text-grey-600">
                          {formatDateTime(event.startDateTime).dateTime}
                        </p>

                        <p className="p-medium-14 md:p-medium-16 text-grey-600">
                          {event.organizer.firstName} {event.organizer.lastName}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ) : (
        <div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] bg-grey-50 py-28 text-center">
          <h3 className="p-bold-20 md:h5-bold">{emptyTitle}</h3>
          <p className="p-regular-14">{emptyStateSubtext}</p>
        </div>
      )}
    </>
  )
}

export default Collection 