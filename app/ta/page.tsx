import { MySubjects } from "@/components/ta/MySubjects";
import { RequireStaff } from "@/components/ta/RequireStaff";
import { ta } from "@/lib/strings";

export default function TaHome() {
  return (
    <main>
      <h1 className="text-2xl font-medium">{ta.home.title}</h1>
      <p className="mt-1 mb-5 text-sm text-muted">{ta.home.intro}</p>
      <RequireStaff>
        <MySubjects />
      </RequireStaff>
    </main>
  );
}
