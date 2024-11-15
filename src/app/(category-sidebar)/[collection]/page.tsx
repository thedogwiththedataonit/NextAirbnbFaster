import { Link } from "@/components/ui/link";
import { getDocumentsInCollection, getCollectionNames, getCountOfAllDocuments } from "@/lib/queries";
import { Star } from 'lucide-react';

import Image from "next/image";

export async function generateStaticParams(): Promise<{ collection: string }[]> {
  const collections = await getCollectionNames();
  return collections.map((collection) => ({
    collection,
  }));
}
export default async function Home(props: {
    params: Promise<{
      collection: string;
    }>;
  }) {
    
  const { collection } = await props.params;
  const [documents] = await Promise.all([
    getDocumentsInCollection(collection),
  ]);
  let imageCount = 0;

  return (
    <div className="w-full">
        <div className="flex flex-row flex-wrap  justify-start gap-6 px-8">
          <h1 className="text-xl font-bold text-slate-600 pb-2">
           Showing {documents.length > 0 ? documents.length : "All"} {collection} listings
          </h1>
        </div>
        <div >
          <div className="flex flex-row flex-wrap justify-center gap-6 border-b-2 py-4">
            {documents.map((bnb: any) => (
              <Link
                prefetch={true}
                key={bnb.name}
                className="flex w-[255px] flex-col items-center text-center"
                href={`/${bnb.collection}/${bnb.bnbId}`}
              >
                <Image
                  loading={imageCount++ < 15 ? "eager" : "lazy"}
                  decoding="sync"
                  //first image in image_urls
                  src={bnb.image_urls[0]}
                  alt={`A small picture of ${bnb.bnbId}`}
                  className="mb-2 h-50 w-full border hover:bg-accent2 rounded-xl"
                  width={100}
                  height={100}
                  quality={70}
                />
                <div className="flex flex-col items-start justify-center w-full px-2 gap-1">
                <span className="text-sm font-semibold tracking-tight text-slate-600 flex items-center justify-between w-full">{bnb.name}
                  <span className="ml-1 text-accent1 flex items-center gap-1 text-xs"><Star size={12} />{bnb.rating}</span>
                </span>
                <span className="text-sm font-normal tracking-tight text-slate-600">{bnb.location}</span>
                <span className="text-sm font-semibold tracking-tight text-slate-600">${parseFloat(bnb.price).toFixed(2)} night</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

    </div>
  );
}
