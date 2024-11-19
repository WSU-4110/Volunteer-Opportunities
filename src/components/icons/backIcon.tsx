import { cn } from "@/lib/utils";

const BackIcon = ({ className }: { className: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={cn("lucide lucide-circle-chevron-left", className)}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m14 16-4-4 4-4" />
    </svg>
  );
};

export default BackIcon;
