import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LevelSwitch } from "@/components/LevelSwitch";
import { ListSkeleton } from "@/components/ListSkeleton";
import { Arriving, Leaving, PageTransition, forward } from "@/components/PageTransition";
import { StateMessage } from "@/components/StateMessage";
import { apiGet } from "@/lib/api";
import { sessionsCount, t } from "@/lib/strings";
import type { SubjectsResponse } from "@/lib/types";

export default function LevelPage({ params }: { params: Promise<{ level: string }> }) {
  return (
    <PageTransition>
      <main>
        <Suspense
          fallback={
            <Leaving>
              <ListSkeleton />
            </Leaving>
          }
        >
          <Arriving>
            <LevelContent params={params} />
          </Arriving>
        </Suspense>
      </main>
    </PageTransition>
  );
}

async function LevelContent({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  if (!/^[1-4]$/.test(level)) notFound();
  const { subjects } = await apiGet<SubjectsResponse>(`/api/v1/discussions/subjects?level=${level}`);
  return (
    <>
      <div className="dq-titlebar dq-titlebar--center">
        <h1 className="title">{t.level.names[Number(level) - 1]}</h1>
        <LevelSwitch current={Number(level)} />
      </div>
      <p className="dq-intro">{t.level.intro}</p>
      <div className="mt-5">
        {subjects.length === 0 ? (
          <StateMessage empty title={t.home.empty.title} body={t.home.empty.body} />
        ) : (
          <ul className="dq-grid">
            {subjects.map((s, i) => (
              <li key={s.id}>
                <Link
                  href={`/subjects/${s.id}`}
                  title={s.name}
                  className={s.sessionCount ? "dq-subject" : "dq-subject dq-subject--none"}
                  transitionTypes={forward}
                >
                  <span className="dq-subject__n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="dq-subject__name" dir="auto">
                    {s.name}
                  </span>
                  <span className="dq-subject__foot">
                    <span>{sessionsCount(s.sessionCount)}</span>
                    {/* One square per discussion, eight at most. */}
                    <span className="dq-subject__dots" aria-hidden="true">
                      {Array.from({ length: Math.min(s.sessionCount, 8) }, (_, dot) => (
                        <i key={dot} />
                      ))}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
