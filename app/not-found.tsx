import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { StateMessage } from "@/components/StateMessage";
import { t } from "@/lib/strings";

export default function NotFound() {
  return (
    <AppShell>
      <main>
        <StateMessage code="404" title={t.state.notFoundTitle} body={t.state.notFoundBody}>
          <Link href="/" className="dq-link text-sm">
            {t.state.goHome}
          </Link>
        </StateMessage>
      </main>
    </AppShell>
  );
}
