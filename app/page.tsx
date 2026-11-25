import Link from "next/link";
import { RememberedLevel } from "@/components/RememberedLevel";
import { t } from "@/lib/strings";

export default function Home() {
  return (
    <main>
      <RememberedLevel />
      <h1 className="text-2xl font-medium">{t.home.title}</h1>
      <p className="mt-1 text-sm text-muted">{t.home.intro}</p>
      <ul className="mt-5 grid grid-cols-2 gap-3">
        {t.level.names.map((name, i) => (
          <li key={name}>
            <Link
              href={`/levels/${i + 1}`}
              className="block rounded-xl border border-line bg-card px-4 py-6 text-center text-base font-medium"
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
