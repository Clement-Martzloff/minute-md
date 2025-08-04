import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-border border-t-1 px-4 py-12">
      <div className="max-w-xl flex-col space-y-1 text-xs md:mx-auto">
        <p>
          <span className="font-semibold">© 2025 Minute.md</span>
        </p>
        <p>Fait avec ❤️ depuis Lyon, France</p>
        <p>
          Propulsé par&nbsp;
          <Link
            href="https://deepmind.google/models/gemini/flash/"
            className="text-primary cursor-pointer underline hover:no-underline"
            target="_blank"
          >
            Gemini 2.5 Flash
          </Link>
          , hébergé par&nbsp;
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
