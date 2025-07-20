import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string; // Optional string
  value: string; // Controlled input value
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Event handler for changes
  className?: string; // Optional className for custom styles
}

export default function SearchBar({
  placeholder = "Search...",
  value,
  onChange,
  className = "",
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10 w-full"
      />
    </div>
  );
}
