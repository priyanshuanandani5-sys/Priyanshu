const PLACEHOLDER_TONES = [
  "bg-cocoa-800",
  "bg-pink-500",
  "bg-caramel-500",
  "bg-sage-500",
  "bg-cocoa-700",
  "bg-pink-600",
];

function toneForName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return PLACEHOLDER_TONES[Math.abs(hash) % PLACEHOLDER_TONES.length];
}

/**
 * Renders a flavor's ImageKit photo when `imagePath` is set, otherwise falls
 * back to a deterministic warm color block with the flavor's initial. Swap
 * in the ImageKit <Image> component here once product photography exists —
 * every caller already passes the same props.
 */
export function FlavorImage({
  name,
  imagePath,
  className,
}: {
  name: string;
  imagePath?: string | null;
  className?: string;
}) {
  if (imagePath) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={imagePath} alt={name} className={className} />;
  }

  return (
    <div
      className={`flex items-center justify-center ${toneForName(name)} ${className ?? ""}`}
    >
      <span className="font-display text-3xl text-cream-50/90">
        {name.charAt(0)}
      </span>
    </div>
  );
}
