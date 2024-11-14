import { Link } from "@/components/ui/link";
import Image from "next/image";
import { GridSmallBackground } from "@/components/GridBackground";
import { TimelineOverview } from "@/components/TimelineOverview";


export default async function Home() {
  return (
    <div className="w-full">

        <div >
          <div className="flex flex-row flex-wrap justify-center gap-6 border-b-2 py-4">
            <GridSmallBackground />
          </div>
          <TimelineOverview />
        </div>

    </div>
  );
}
