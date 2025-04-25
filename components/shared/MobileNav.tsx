"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image"
import { Separator } from "../ui/separator"
import NavItems from "./NavItems"
import { Button } from "../ui/button"
import Link from "next/link"

const MobileNav = () => {
  return (
    <nav className="md:hidden">
      <Sheet>
        <SheetTrigger className="align-middle">
          <Image 
            src="/assets/icons/menu.svg"
            alt="menu"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-6 bg-white md:hidden">
          <SheetHeader>
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>
              Access all navigation options
            </SheetDescription>
          </SheetHeader>
          <Image 
            src="/assets/images/new-logo.png"
            alt="logo"
            width={19}
            height={8}
          />
          <Separator className="border border-gray-50" />
          <NavItems />
          <Button size="lg" asChild className="button w-full bg-purple-gradient">
            <Link href="#events">
              Explore Now
            </Link>
          </Button>
        </SheetContent>
      </Sheet>
    </nav>
  )
}

export default MobileNav