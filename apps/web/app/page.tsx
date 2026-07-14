"use client";

import { trpc } from "~/trpc/client";

export default function Home() {
  const { data } = trpc.chaicode.useQuery({ email: "sp1@gmail.com", name: "Surya", age: 27 })
  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center">
      <div>
        <h1 className="text-3xl">Streamyst - Stream in Style</h1>
        <h2>Server Message: {data?.message} name: {data?.name} age: {data?.age}</h2>
      </div>
    </main>
  );
}
