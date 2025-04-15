import { BookOpenText, Layers, Users } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function HomeHeader() {
  return (
    <header className="border max-w-xl mx-auto p-3 rounded-md flex flex-col xl:flex-row gap-5 xl:items-center justify-between">
      <Link href={"/"} className="text-xl font-bold ">
        Veritas
      </Link>
      <ul className="flex gap-5 items-center">
        <li>
          <Link
            href={"/proposal"}
            className="text-sm flex gap-2 items-center text-muted-foreground hover:text-primary duration-300"
          >
            <Layers />
            Proposals
          </Link>
        </li>
        <li>
          <Link
            href={"/"}
            className="text-sm flex gap-2 items-center text-muted-foreground hover:text-primary duration-300"
          >
            <Users />
            Community
          </Link>
        </li>
        <li>
          <Link
            href={"/"}
            className="text-sm flex gap-2 items-center text-muted-foreground hover:text-primary duration-300"
          >
            <BookOpenText />
            Docs
          </Link>
        </li>
      </ul>
    </header>
  );
}
