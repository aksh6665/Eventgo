"use client"

import { Button } from "@/components/ui/button"
import { CheckoutOrderParams } from "@/types"
import { loadStripe } from "@stripe/stripe-js"
import { useEffect } from "react"
import { checkoutOrder } from "@/lib/actions/order.actions"

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

type CheckoutButtonProps = {
  event: {
    _id: string
    title: string
    price: string
    isFree: boolean
    imageUrl: string
  }
  userId: string
}

const CheckoutButton = ({ event, userId }: CheckoutButtonProps) => {
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search)
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.')
    }

    if (query.get('canceled')) {
      console.log("Order canceled -- continue to shop around and checkout when you're ready.")
    }
  }, [])

  const onCheckout = async () => {
    const order: CheckoutOrderParams = {
      eventTitle: event.title,
      eventId: event._id,
      price: event.price,
      isFree: event.isFree,
      buyerId: userId
    }

    await checkoutOrder(order)
  }

  return (
    <Button
      onClick={onCheckout}
      size="lg"
      className="button w-full sm:w-fit"
    >
      {event.isFree ? 'Get Ticket' : 'Buy Ticket'}
    </Button>
  )
}

export default CheckoutButton 