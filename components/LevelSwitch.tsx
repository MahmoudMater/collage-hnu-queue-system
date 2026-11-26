import Link from "next/link";
import { t } from "@/lib/strings";
import { back, forward } from "./PageTransition";

/** Beside a level's title: the four levels as squares, the current one filled. */
export function LevelSwitch({ current }: { current: number }) {
  return (
    <nav className="dq-seg" aria-label={t.level.switch}>
      {t.level.names.map((name, i) => (
        <Link
          key={name}
          href={`/levels/${i + 1}`}
          aria-label={name}
          aria-current={current === i + 1 ? "page" : undefined}
          transitionTypes={i + 1 < current ? back : forward}
        >
          {i + 1}
        </Link>
      ))}
    </nav>
  );
}
