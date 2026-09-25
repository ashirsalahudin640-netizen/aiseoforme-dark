import React from "react"
import Link from "next/link"
import { ArrowRight, Globe } from "lucide-react"

import { cn } from "@/lib/utils"

interface WrapButtonProps {
  className?: string
  children: React.ReactNode
  href?: string
}

/** Skiper UI wrap button, restyled for the pearl + orange palette. */
const WrapButton: React.FC<WrapButtonProps> = ({ className, children, href = "#contact" }) => {
  return (
    <Link
      href={href}
      className={cn(
        "press group inline-flex h-[60px] items-center gap-2 rounded-full border border-ink/80 bg-ink p-[9px] pr-4",
        className
      )}
    >
      <span className="flex h-[42px] items-center justify-center rounded-full bg-orange pl-2 pr-4 text-white transition-colors duration-200 group-hover:bg-orange-deep">
        <Globe aria-hidden="true" className="mx-1.5 size-[18px] animate-[spin_6s_linear_infinite]" />
        <span className="font-medium tracking-tight">{children}</span>
      </span>
      <span className="flex size-[26px] items-center justify-center rounded-full border-2 border-white/30 text-white/80 transition-[margin,transform] duration-300 ease-[var(--ease-out)] group-hover:ml-1.5">
        <ArrowRight aria-hidden="true" size={16} className="transition-transform duration-300 ease-[var(--ease-out)] group-hover:-rotate-45" />
      </span>
    </Link>
  )
}

export default WrapButton
