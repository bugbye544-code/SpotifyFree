import Image from "next/image";
import { cn, getImageUrl } from "@/lib/utils";

export function CoverArt({
  images,
  alt,
  className
}: {
  images?: { url: string }[];
  alt: string;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-[8px] bg-panel-2", className)}>
      <Image src={getImageUrl(images)} alt={alt} fill className="object-cover" sizes="320px" />
    </div>
  );
}
