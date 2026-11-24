import Link from "next/link";
import { StateMessage } from "@/components/StateMessage";
import { t } from "@/lib/strings";

export default function NotFound() {
  return (
    <StateMessage title={t.state.notFoundTitle} body={t.state.notFoundBody}>
      <Link href="/" className="text-sm text-accent">
        {t.state.goHome}
      </Link>
    </StateMessage>
  );
}
