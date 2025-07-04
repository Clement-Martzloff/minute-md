import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t-4 border-black py-6">
      <div className="container mx-auto grid grid-cols-1 gap-3 px-3 text-center md:px-6 lg:grid-cols-3 lg:gap-6 lg:text-left xl:max-w-5xl">
        <p className="text-muted-foreground col-span-1 text-sm">
          © 2025 r/blog
        </p>
        <p className="text-muted-foreground text-sm">
          Built with ❤️ from Lyon, France
        </p>
        <p className="text-muted-foreground text-sm">
          Hosted by&nbsp;
          <Link
            href="https://vercel.com/"
            className="text-primary cursor-pointer underline hover:no-underline"
            target="_blank"
          >
            Vercel
          </Link>
        </p>
      </div>
    </footer>
  );
}
