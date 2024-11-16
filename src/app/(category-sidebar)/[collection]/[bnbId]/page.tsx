import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "@/components/ui/link";

import { getDocumentById, getRelatedDocuments, getCollectionNames, getDocumentsInCollection } from "@/lib/queries";
import { Star, User } from "lucide-react";

export async function generateStaticParams(): Promise<{ collection: string; bnbId: string }[]> {
    const collections = await getCollectionNames();
    const params = await Promise.all(
      collections.map(async (collection) => {
        const documents = await getDocumentsInCollection(collection);
        return documents.map((bnb) => ({
          collection,
          bnbId: bnb.bnbId,
        }));
      })
    );
    return params.flat();
  }

export default async function Page(props: {
    params: Promise<{
        collection: string;
        bnbId: string;
    }>;
}) {
    const { collection, bnbId } = await props.params;
    const [bnbData, related] = await Promise.all([
        getDocumentById(collection, bnbId),
        getRelatedDocuments(collection, bnbId),
    ]);

    if (!bnbData) {
        return notFound();
    }

    return (
        <div className="w-full px-4 sm:px-0 md:px-32 lg:px-32 xl:px-64">
            <div className="flex flex-col gap-2 pt-4">
                <h1 className="text-2xl font-bold text-slate-800 pb-2">
                    {bnbData.name}
                </h1>
                <div className="flex flex-row gap-1 justify-center">
                    <Image
                        loading="eager"
                        decoding="sync"
                        src={bnbData.image_urls[0]}
                        alt={`A small picture of ${bnbData.name}`}
                        height={300}
                        quality={75}
                        width={256}
                        className="flex-shrink-0 w-[505px] h-[405px] rounded-l-2xl"
                    />
                    <div className="w-fit grid grid-cols-2 gap-1">
                        <Image
                            loading="eager"
                            decoding="sync"
                            src={bnbData.image_urls[1]}
                            alt={`A small picture of ${bnbData.name}`}
                            height={150}
                            quality={50}
                            width={150}
                            className="flex-shrink-0  w-[200px] h-[200px]"
                        />
                        <Image
                            loading="eager"
                            decoding="sync"
                            src={bnbData.image_urls[2]}
                            alt={`A small picture of ${bnbData.name}`}
                            height={150}
                            quality={50}
                            width={150}
                            className="flex-shrink-0  w-[200px] h-[200px] rounded-tr-2xl"
                        />
                        <Image
                            loading="eager"
                            decoding="sync"
                            src={bnbData.image_urls[3]}
                            alt={`A small picture of ${bnbData.name}`}
                            height={150}
                            quality={50}
                            width={150}
                            className="flex-shrink-0  w-[200px] h-[200px]"
                        />
                        <Image
                            loading="eager"
                            decoding="sync"
                            src={bnbData.image_urls[4]}
                            alt={`A small picture of ${bnbData.name}`}
                            height={150}
                            quality={50}
                            width={150}
                            className="flex-shrink-0  w-[200px] h-[200px] rounded-br-2xl"
                        />
                    </div>
                </div>
                <div className="flex flex-row gap-1 justify-center border-b-2 py-4 items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">
                    A {bnbData.name} in {bnbData.location}
                </h2>
                <p className="flex items-center gap-2 text-md font-semibold text-slate-600">
                    <Star size={20} />
                    {bnbData.rating} stars
                </p>
                </div>
                <p className="flex-grow text-base border-b-2 py-4">{bnbData.description}</p>
                
                <div className="flex flex-row gap-1 justify-start items-center gap-3 py-4">
                    <span className="text-md font-semibold text-slate-800 border rounded border-slate-100 shadow-md p-2">
                        {bnbData.guests} Guests
                    </span>
                    <span className="text-md font-semibold text-slate-800 border rounded border-slate-100 shadow-md p-2">
                        {bnbData.bedrooms} Bedrooms
                    </span>
                    <span className="text-md font-semibold text-slate-800 border rounded border-slate-100 shadow-md p-2">
                        {bnbData.beds} Beds
                    </span>
                    <span className="text-md font-semibold text-slate-800 border rounded border-slate-100 shadow-md p-2">
                        {bnbData.bathrooms} Bathrooms
                    </span>
                    <span className="text-md font-semibold text-slate-800 border rounded border-slate-100 shadow-md p-2">
                        {bnbData.size}
                    </span>
                </div>
                
                
                <div className="flex flex-row gap-1 justify-start items-center gap-3 py-4">
                    <User size={40} className="text-slate-600 bg-slate-200 rounded-full p-2"/>
                    <div className="flex flex-col gap-1">
                    <p className="text-md font-semibold text-slate-600">
                        Hosted by John Doe
                    </p>
                    <p className="text-md font-normal text-slate-600">
                        Cheese enthusiast and Airbnb Superhost
                    </p>
                    </div>
                </div>
                <div className="border-y-2 border-slate-100 px-4 flex flex-row gap-1 justify-between items-center gap-3 py-4">
                <span>
                <p className="text-xl font-bold">
                    ${parseFloat(bnbData.price).toFixed(2)} Per Night
                </p>
                <p className="text-lg font-semibold">
                    {bnbData.reviews} Reviews
                </p>
                </span>
                
                <button className="bg-accent1 text-white rounded-lg p-4 font-semibold">
                    Book Now
                </button>
                </div>
            </div>
            <div className="flex flex-col gap-2 overflow-scroll pt-6">
                <h1 className="text-lg font-bold text-slate-600">
                    Related Airbnbs
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
                    {related.map((bnb) => (
                        <Link
                            prefetch={true}
                            href={`/${collection}/${bnb.bnbId}`}
                            key={bnb.bnbId}
                            className="flex flex-col gap-4 cursor-pointer hover:bg-slate-100 p-3 rounded-lg transition-all"
                        >
                            <div className="aspect-square relative w-full">
                                <Image
                                    loading="eager"
                                    decoding="sync"
                                    src={bnb.image_urls[0]}
                                    alt={`A small picture of ${bnb.name}`}
                                    fill
                                    quality={35}
                                    className="object-cover rounded-2xl"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-semibold text-slate-800 truncate">
                                    {bnb.name}
                                </p>
                                <p className="text-sm font-normal text-slate-600">
                                    {bnb.location}
                                </p>
                                <p className="text-sm font-semibold text-slate-800">
                                    ${parseFloat(bnb.price).toFixed(2)}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>



            </div>

        </div>
    );
}