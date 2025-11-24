export default function Container({
  children,
  maxWidth = "5xl"
}: {
  children: React.ReactNode;
  maxWidth?: "4xl" | "5xl" | "6xl" | "7xl";
}) {
  const widths = {
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl"
  };

  return <div className={`mx-auto w-full ${widths[maxWidth]} px-4`}>{children}</div>;
}