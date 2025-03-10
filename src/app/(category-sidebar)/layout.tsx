import { Link } from "@/components/ui/link";
import { getCollectionNames, } from "@/lib/queries";
import { collectionsList } from "@/lib/CollectionIcons";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const allCollections = await getCollectionNames();
  return (
    <div className="flex flex-col w-full flex-grow font-mono w-full overflow-hidden">
      <ul className="flex flex-row items-start justify-center gap-2 border-b border-slate-100 shadow-md overflow-x-auto">
        {allCollections.map((collection) => (
          <li key={collection} id={collection}>
            <Link
              prefetch={true}
              href={`/${collection}`}
              className="block w-full py-1 text-xs text-gray-800 hover:underline"
            >
              <div className="font-semibold text-slate-600 p-3 flex flex-col items-center justify-center gap-2">
                {collectionsList.find((c) => c.name === collection)?.icon}
                {collection}
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <main
        className="h-[calc(100vh-145px)] overflow-y-auto p-4 pt-6"
        id="main-content"
      >
        {children}
      </main>
    </div>
  );
}
