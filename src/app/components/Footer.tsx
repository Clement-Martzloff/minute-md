import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-border border-t-1 px-4 py-12">
      <div className="text-muted-foreground max-w-xl flex-col space-y-2 text-sm md:mx-auto">
        <p>
          <span className="font-semibold">© 2025 Minute.md</span>
        </p>
        <p>Built with ❤️ from Lyon, France</p>
        <p>
          Hosted by&nbsp;
          <Link
            href="https://vercel.com/"
            className="text-accent cursor-pointer underline hover:no-underline"
            target="_blank"
          >
            Vercel
          </Link>
        </p>
      </div>
    </footer>
  );
}
