import Link from "next/link";
import { HeroDemo } from "@/components/landing/HeroDemo";
import { PageTransition, forward } from "@/components/PageTransition";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { QueueList } from "@/components/live/Queue";
import { t } from "@/lib/strings";
import type { QueueItem } from "@/lib/types";

const L = t.landing;

/** The invented discussion the landing page shows as a picture. */
const demo = L.demo;
const queueOf = (teams: readonly { number: number; leaderName: string; time: string | null }[]): QueueItem[] =>
  teams.map((team, i) => ({ ...team, position: i + 1, reason: null }));
const demoMain = queueOf(demo.main);

/** The front page: what the site does, then the way in. Nothing is remembered between visits. */
export default function Home() {
  return (
    <div className="dq-lp dq-shell">
      <SiteHeader>
        <a href="#how">{L.nav.how}</a>
        <a href="#leaders">{L.nav.leaders}</a>
        <a href="#faq">{L.nav.faq}</a>
        <a className="dq-btn dq-btn--primary" href="#levels">
          {L.nav.open}
        </a>
      </SiteHeader>

      <PageTransition>
        <main>
          <div className="dq-wrap">
            <section className="dq-lp__hero">
              <div>
                <p className="dq-lp__kicker dq-overline">
                  <span className="dq-badge dq-badge--ok dq-badge--live">{t.live.live}</span>
                  {L.kicker}
                </p>
                <h1 className="display-xl">
                  {L.headline} <span className="dq-hl">{L.headlineMark}</span>
                </h1>
                <p className="dq-lp__sub">{L.sub}</p>
                <div className="dq-lp__cta">
                  <a className="dq-btn dq-btn--primary dq-btn--lg" href="#levels">
                    {L.cta}
                  </a>
                  <a className="dq-btn dq-btn--secondary dq-btn--lg" href="#how">
                    {L.nav.how}
                  </a>
                </div>
                <p className="dq-lp__note">{L.note}</p>
              </div>
              {/* A picture of the live screen, not a working one. It plays on its own. */}
              <div className="dq-lp__demo" aria-hidden="true" inert>
                <div className="dq-card">
                  <div className="dq-lp__demohead">
                    <div>
                      <p className="body-strong">{demo.subject}</p>
                      <p className="text-sm text-muted">
                        {demo.ta} · {demo.label}
                      </p>
                    </div>
                    <span className="dq-badge dq-badge--ok dq-badge--live">{t.live.live}</span>
                  </div>
                  <HeroDemo />
                </div>
              </div>
            </section>
          </div>

          <section className="dq-lp__section" id="levels">
            <div className="dq-wrap">
              <div className="dq-lp__head">
                <Index n={1}>{L.sections.start}</Index>
                <h2 className="display-lg">{t.home.title}</h2>
                <p>{t.home.intro}</p>
              </div>
              <div className="dq-lp__levels">
                {t.level.names.map((name, i) => (
                  <Link key={name} href={`/levels/${i + 1}`} className="dq-level" transitionTypes={forward}>
                    <span className="dq-level__n">{i + 1}</span>
                    <span className="dq-level__l">
                      {name}
                      {/* The step meter: four rising bars, as many lit as the level. */}
                      <span className="dq-level__steps" aria-hidden="true">
                        {[1, 2, 3, 4].map((step) => (
                          <i key={step} className={step <= i + 1 ? "is-on" : undefined} />
                        ))}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="dq-lp__section" id="how">
            <div className="dq-wrap">
              <div className="dq-lp__head">
                <Index n={2}>{L.sections.how}</Index>
                <h2 className="display-lg">{L.stepsTitle}</h2>
              </div>
              <ol className="dq-lp__steps">
                {L.steps.map((step, i) => (
                  <li key={step.title} className="dq-step">
                    <p className="dq-step__n">0{i + 1}</p>
                    <h3 className="heading">{step.title}</h3>
                    <p>{step.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="dq-lp__section">
            <div className="dq-wrap">
              <div className="dq-lp__head">
                <Index n={3}>{L.sections.get}</Index>
                <h2 className="display-lg">{L.featuresTitle}</h2>
              </div>
              <ol className="dq-feats">
                <Feature n={1} {...L.features.live}>
                  <QueueList items={demoMain.slice(0, 2)} late={false} mine={demo.mine} empty="" />
                </Feature>
                <Feature n={2} {...L.features.pace}>
                  <p className="dq-pace dq-pace--late">{t.schedule.delay(10)}</p>
                  <p className="dq-notice">
                    {t.schedule.onBreak} ({t.schedule.breakReasons.PRAYER}) · {t.schedule.backAt}{" "}
                    <span className="dq-nowrap">{demo.breakBack}</span>
                  </p>
                </Feature>
                <Feature n={3} {...L.features.sound}>
                  <p className="dq-notice dq-notice--ok font-semibold">{t.alert.near(3)}</p>
                </Feature>
                <Feature n={4} {...L.features.late}>
                  <p className="dq-notice">{t.leader.queued}</p>
                </Feature>
                <Feature n={5} {...L.features.sheet}>
                  <span className="flex items-center gap-3 text-sm text-muted">
                    <span className="dq-session__sheet">
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 2v8M4.5 7 8 10.5 11.5 7M3 13h10" />
                      </svg>
                    </span>
                    {t.session.downloadSheet}
                  </span>
                </Feature>
              </ol>
            </div>
          </section>

          <section className="dq-lp__section" id="leaders">
            <div className="dq-wrap">
              <div className="dq-lp__band">
                <div>
                  <Index n={4}>{L.sections.leaders}</Index>
                  <h2 className="display-lg">
                    {L.leadersTitle} <em>{L.leadersMark}</em> {L.leadersTail}
                  </h2>
                  <p>{L.leadersBody}</p>
                </div>
                <div className="dq-call" aria-hidden="true" inert>
                  <p className="dq-call__text">{t.leader.yourTurn}</p>
                  <div className="dq-call__row">
                    <span className="dq-btn dq-btn--go dq-btn--lg">{t.leader.coming}</span>
                    <span className="dq-call__secs">{demo.inside.seconds}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="dq-lp__section dq-lp__section--split" id="faq">
            <div className="dq-wrap">
              <div className="dq-lp__head">
                <Index n={5}>{L.sections.faq}</Index>
                <h2 className="display-lg">{L.faqTitle}</h2>
              </div>
              <div className="dq-lp__faq">
                {L.faq.map((item, i) => (
                  <details key={item.q} open={i === 0}>
                    <summary>{item.q}</summary>
                    <p>{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section className="dq-lp__section dq-lp__close">
            <div className="dq-wrap">
              <h2 className="display-xl">
                {L.closing} <span className="dq-hl">{L.closingMark}</span>
              </h2>
              <div className="dq-lp__cta">
                <a className="dq-btn dq-btn--primary dq-btn--lg" href="#levels">
                  {L.cta}
                </a>
              </div>
            </div>
          </section>
        </main>
      </PageTransition>

      <SiteFooter />
    </div>
  );
}

/** The small numbered label above a section's title. */
function Index({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <p className="dq-lp__index">
      <b>0{n}</b>
      {children}
    </p>
  );
}

/** One row of the feature board: its number, what it is, and a small picture of it. */
function Feature({ n, title, body, children }: { n: number; title: string; body: string; children: React.ReactNode }) {
  return (
    <li className="dq-feat">
      <span className="dq-feat__n">0{n}</span>
      <div>
        <h3 className="heading">{title}</h3>
        <p>{body}</p>
      </div>
      <div className="dq-feat__demo" aria-hidden="true" inert>
        {children}
      </div>
    </li>
  );
}
