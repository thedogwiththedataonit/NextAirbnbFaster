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
      clientToken={"abe89ed89b5588dd1600bfd127627681884bfb31f3bd6dd8f44b916b436b03dd"}
      userInfo={{
        userId: Math.floor(Date.now() / 1000).toString(),
        userFirstName: "Anonymous",
        userLastName: "User",
        userEmail: "anonymous@example.com",
        userType: "demo",
      }}
      devMode={false}
    >
      {children}
    </DemoPenguinClient>
  );
}