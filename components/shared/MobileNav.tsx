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
          <div className="flex items-center gap-2">
            <Image 
              src="/assets/images/new-logo.png"
              alt="logo"
              width={38}
              height={8}
            />
            <span className="text-black font-bold text-xl">Eventgo</span>
          </div>
          <Separator className="border border-gray-50" />
          <NavItems />
        </SheetContent>
      </Sheet>    
    </nav>
  )
}

export default MobileNav