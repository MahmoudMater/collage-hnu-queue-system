import { SignInButton } from "@/components/ta/SignInButton";
import { ta } from "@/lib/strings";

export default function SignInPage() {
  return (
    <main>
      <h1 className="text-2xl font-medium">{ta.signIn.title}</h1>
      <p className="mt-1 mb-5 text-sm text-muted">{ta.signIn.body}</p>
      <SignInButton />
    </main>
  );
}
