import { ModeToggle } from "@/components/ui/mode-toggle";
import { LanguageParam } from "@/types/ui";
import List from "./_components/list";
import RefetchButton from "@/components/ui/refetch";

// import { LangSwitcher } from "@/components/ui/lang-switch";

export default async function Home({ params: { lng } }: LanguageParam) {
  return (
    <main>
      <nav className="flex h-[60px] sticky z-50 top-0 border-b bg-primary items-center px-4 justify-between dark:bg-[#020817]">
        <h1 className="text-white">Tashkent Metall</h1>
        <RefetchButton />
        <div className="flex gap-2">
          {/* <LangSwitcher lng={lng} /> */}
          <ModeToggle />
        </div>
      </nav>
      <div>
        <List />
      </div>
    </main>
  );
}
