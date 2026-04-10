import { Platform } from "@/utils/types/platform";
import { Settings, SettingsSchema } from "@/utils/types/settings";
import { ClampedNumberInput } from "@/components/custom/ClampedNumberInput";
import { FontSelect } from "@/components/custom/FontSelect";
import { PlatformSelect } from "@/components/custom/PlatformSelect";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Switch } from "@/components/ui/switch";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { getPlatform } from "@/entrypoints/content/utils/get-platform";

const Storage = storage.defineItem<Settings>("local:Settings", {
  fallback: SettingsSchema.parse({}),
});

function App() {
  const [platform, setPlatform] = useState<Platform>("youtube");
  const [settings, setSettings] = useState<Settings | null>();

  useEffect(() => {
    Storage.getValue().then(setSettings);

    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url;
      const detected = getPlatform(url);
      if (detected) setPlatform(detected);
    });
  }, []);

  async function update<K extends keyof Settings>(key: K, value: Settings[K][Platform]) {
    if (!settings) return;
    const newSettings = {
      ...settings,
      [key]: { ...settings[key], [platform]: value },
    };
    await Storage.setValue(newSettings);
    setSettings(newSettings);
  }

  if (!settings) return null;

  const Items: { key: string; render: (platform: Platform) => React.ReactNode }[] = [
    {
      key: "platform",
      render: () => <PlatformSelect className="w-25" value={platform} onChange={setPlatform} />,
    },
    {
      key: "enable",
      render: (p) => <Switch checked={settings.enable[p]} onCheckedChange={(v) => update("enable", v)} />,
    },
    {
      key: "decoration",
      render: (p) => <Switch checked={settings.decoration[p]} onCheckedChange={(v) => update("decoration", v)} />,
    },
    {
      key: "font",
      render: (p) => (
        <FontSelect className="w-40" value={settings.fontFamily[p]} onChange={(v) => update("fontFamily", v)} />
      ),
    },
    {
      key: "fontSize",
      render: (p) => (
        <ClampedNumberInput
          className="w-[5rem]"
          value={settings.fontSize[p]}
          onChange={(v) => update("fontSize", v)}
          min={1}
          max={50}
        />
      ),
    },
    {
      key: "fontOpacity",
      render: (p) => (
        <ClampedNumberInput
          className="w-[5rem]"
          value={settings.fontOpacity[p]}
          onChange={(v) => update("fontOpacity", v)}
          min={0}
          max={100}
        />
      ),
    },
    {
      key: "displayTime",
      render: (p) => (
        <ClampedNumberInput
          className="w-[5rem]"
          value={settings.displayTime[p]}
          onChange={(v) => update("displayTime", v)}
          min={1}
          max={100}
        />
      ),
    },
    {
      key: "displayLimit",
      render: (p) => (
        <ClampedNumberInput
          className="w-[5rem]"
          value={settings.displayLimit[p]}
          onChange={(v) => update("displayLimit", v)}
          min={0}
          max={1000}
        />
      ),
    },
    {
      key: "displayRange",
      render: (p) => (
        <ClampedNumberInput
          className="w-[5rem]"
          value={settings.displayRange[p]}
          onChange={(v) => update("displayRange", v)}
          min={0}
          max={100}
        />
      ),
    },
    {
      key: "donate",
      render: () => (
        <a href="https://ko-fi.com/H2H41FVD99" target="_blank">
          <img
            className="border-0 h-8"
            src="https://storage.ko-fi.com/cdn/kofi6.png?v=6"
            alt="Buy Me a Coffee at ko-fi.com"
          />
        </a>
      ),
    },
    {
      key: "github",
      render: () => (
        <a
          href="https://github.com/sakana102/DanmakuSystem"
          target="_blank"
          className="flex items-center justify-center h-8 w-32 rounded-md bg-black text-white dark:bg-white dark:text-black"
        >
          <span>GitHub</span>
        </a>
      ),
    },
  ];

  return (
    <main className="w-[330px]">
      <ThemeProvider defaultTheme="system">
        {Items.map(({ key, render }) => (
          <div
            key={key}
            className="flex items-center justify-between w-full h-12 px-2 border-b border-border last:border-b-0"
          >
            <div className="flex items-center justify-center gap-1.5">
              <HoverCard openDelay={10} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <span className="text-sm">{i18n.t(`settings.${key}.title`)}</span>
                </HoverCardTrigger>
                <HoverCardContent className="flex w-64 flex-col gap-0.5">
                  <div>{i18n.t(`settings.${key}.info`)}</div>
                </HoverCardContent>
              </HoverCard>
            </div>
            {render(platform)}
          </div>
        ))}
      </ThemeProvider>
    </main>
  );
}

export default App;
