 'use client';
//we need to wrap the children in the DemoPenguinWrapper component so that we can dynamically load the DemoPenguin component since it is a client component

import dynamic from 'next/dynamic';

const DemoPenguinClient = dynamic(
  () => import('demo-penguin').then(mod => ({ default: mod.DemoPenguin })),
  { ssr: false }
);

export function DemoPenguinWrapper({ children }: { children: React.ReactNode }) {
  return (
    <DemoPenguinClient
      clientToken={process.env.NEXT_PUBLIC_DEMO_PENGUIN_CLIENT_TOKEN || ""}
      userId={Math.floor(Date.now() / 1000).toString()}
      firstName="Anonymous"
      lastName="User"
      userEmail="anonymous@example.com"
      additionalInfo={{
        company: "AirbnbFaster",
        role: "User",
      }}
      devMode={false}
    >
      {children}
    </DemoPenguinClient>
  );
}