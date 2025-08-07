import { AuroraText } from "@/src/components/magicui/aurora-text";

export default function Hero() {
  return (
    <div className="space-y-6 text-center">
      <h1 className="text-center text-4xl font-extrabold tracking-tight text-balance md:text-5xl">
        Vous allez aimer être <span className="line-through">fainéant</span>
        &nbsp;
        <AuroraText colors={["#ff00c8", "#9000ff", "#00e5ff", "#00ffcc"]}>
          efficace
        </AuroraText>
      </h1>
      <p className="text-lg leading-7 md:text-xl md:leading-8">
        Des comptes rendus propres, standards, lisibles même par votre manager.
        Déposez vos notes de réunion et laissez faire l&apos;IA ! ✨
      </p>
    </div>
  );
}
