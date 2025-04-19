import Image from "next/image"
import Link from "next/link"

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="wrapper flex flex-col items-center justify-between gap-4 p-5 text-center sm:flex-row">
        <Link href='/' className="flex items-center gap-2">
          <Image 
            src="/assets/images/new-logo.png"
            alt="logo"
            width={18}
            height={8}
          />
          <span className="text-black font-bold text-sm">Eventgo</span>
        </Link>

        <p>2025 Eventgo. All Rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer