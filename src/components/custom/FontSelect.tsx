import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  className?: string;
  value: string;
  onChange: (value: string) => void;
};

export function FontSelect(props: Props) {
  const [fonts, setFonts] = useState<string[]>([]);

  useEffect(() => {
    browser.fontSettings.getFontList().then((list) => {
      setFonts(list.map((font) => font.fontId));
    });
  }, []);

  return (
    <Select
      value={props.value || "default"}
      onValueChange={(value) => props.onChange(value === "default" ? "" : value)}
    >
      <SelectTrigger className={props.className}>
        <SelectValue placeholder="デフォルト" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">デフォルト</SelectItem>
        {fonts.map((font) => (
          <SelectItem key={font} value={font} style={{ fontFamily: font }}>
            {font}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
