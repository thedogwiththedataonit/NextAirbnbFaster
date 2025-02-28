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
      clientToken={"6c1ddbdfebd2bdb5ca1eb7a37ae3f07956bbb23d37f4e1ed64f9e9c047c74c1a"}
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