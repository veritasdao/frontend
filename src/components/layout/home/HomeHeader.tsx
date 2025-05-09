import { BookOpenText, Earth, Layers } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function HomeHeader() {
  return (
    <header className="max-w-7xl mx-auto p-3 rounded-md flex flex-col xl:flex-row gap-5 xl:items-center justify-between">
      <Link href={"/"} className="text-3xl font-bold ">
        Veritas
      </Link>
      <ul className="flex gap-5 items-center">
        <li>
          <Link
            href={"/proposal"}
            className="text-sm flex gap-2 items-center text-muted-foreground hover:text-primary duration-300"
            target="_blank"
          >
            <Layers />
            Proposals
          </Link>
        </li>
        <li>
          <Link
            href={"/"}
            target="_blank"
            className="text-sm flex gap-2 items-center text-muted-foreground hover:text-primary duration-300"
          >
            <Earth />
            Ecosystem
          </Link>
        </li>
        <li>
          <Link
            href={"/"}
            className="text-sm flex gap-2 items-center text-muted-foreground hover:text-primary duration-300"
            target="_blank"
          >
            <BookOpenText />
            Documentation
          </Link>
        </li>
      </ul>
    </header>
  );
}
