import SignInButton from "@/components/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-5xl text-cyan-400">JV-Slayer</h1>
      <SignInButton />
    </div>
  );
}
