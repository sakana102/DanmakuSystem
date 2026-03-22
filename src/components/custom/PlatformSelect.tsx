import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Platform, PlatformSchema } from "@/utils/types/platform";

type Props = {
  className?: string;
  value: Platform;
  onChange: (value: Platform) => void;
};

const PlatformStyles: Record<Platform, string> = {
  youtube: "bg-red-500 dark:bg-red-500 hover:dark:bg-red-500 text-white [&_svg]:text-red-50",
  twitch: "bg-purple-500 dark:bg-purple-500 hover:dark:bg-purple-500 text-white [&_svg]:text-purple-50",
  kick: "bg-green-500 dark:bg-green-500 hover:dark:bg-green-500 text-white [&_svg]:text-green-50",
  openrec: "bg-orange-500 dark:bg-orange-500 hover:dark:bg-orange-500 text-white [&_svg]:text-orange-50",
  twicas: "bg-blue-500 dark:bg-blue-500 hover:dark:bg-blue-500 text-white [&_svg]:text-blue-50",
};

export function PlatformSelect(props: Props) {
  return (
    <Select value={props.value} onValueChange={(value) => props.onChange(value as Platform)}>
      <SelectTrigger className={cn(PlatformStyles[props.value], props.className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PlatformSchema.options.map((platform) => (
          <SelectItem key={platform} value={platform}>
            {platform}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
