import { Link } from "@/components/ui/link";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex flex-col w-full flex-grow font-mono w-full">
      
      <main
        className="h-[calc(100vh-113px)] overflow-y-auto p-4 pt-0"
        id="main-content"
      >
        {children}
      </main>
    </div>
  );
}
