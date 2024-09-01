import Link from "next/link";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between pb-40 w-full">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-3xl">
          <div className="flex gap-5 items-center font-semibold">
            <Link href="/" className="flex flex-row gap-1">
              <h1>ACE</h1>
              <h1 className="text-green-500">IT</h1>
            </Link>
          </div>
          {/* <HeaderAuth/> */}
        </div>
      </nav>
      <div className="w-full flex justify-center items-center">{children}</div>
      <div></div>
    </div>
  );
}
