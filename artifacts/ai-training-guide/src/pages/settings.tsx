import { useCustomization } from "@/lib/customization-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Monitor, Moon, Sun, Sidebar, Menu, Type } from "lucide-react";

const themes = [
  { id: "zinc", name: "Monochrome", color: "bg-zinc-900 dark:bg-zinc-100" },
  { id: "indigo", name: "Indigo", color: "bg-indigo-500" },
  { id: "emerald", name: "Emerald", color: "bg-emerald-500" },
  { id: "violet", name: "Violet", color: "bg-violet-500" },
  { id: "orange", name: "Orange", color: "bg-orange-500" },
  { id: "cyan", name: "Cyan", color: "bg-cyan-500" },
  { id: "rose", name: "Rose", color: "bg-rose-500" },
] as const;

const fontSizes = {
  sm: 0,
  md: 33,
  lg: 66,
  xl: 100
};

const fontValues = {
  0: "sm",
  33: "md",
  66: "lg",
  100: "xl"
} as const;

export default function Settings() {
  const { 
    themeColor, setThemeColor,
    fontSize, setFontSize,
    layout, setLayout,
    readingMode, setReadingMode,
    colorScheme, setColorScheme
  } = useCustomization();

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12 border-b border-border pb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Environment Settings</h1>
        <p className="text-muted-foreground">Customize your workspace experience. All changes save automatically.</p>
      </div>

      <div className="grid gap-8">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Control the visual theme and mode.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <Label className="text-base">Color Scheme</Label>
              <RadioGroup 
                value={colorScheme} 
                onValueChange={(val: any) => setColorScheme(val)}
                className="flex flex-wrap gap-4"
              >
                <Label htmlFor="light" className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:bg-muted [&:has([data-state=checked])]:border-primary w-40">
                  <div className="flex items-center gap-2"><Sun className="w-4 h-4" /> Light</div>
                  <RadioGroupItem value="light" id="light" />
                </Label>
                <Label htmlFor="dark" className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:bg-muted [&:has([data-state=checked])]:border-primary w-40">
                  <div className="flex items-center gap-2"><Moon className="w-4 h-4" /> Dark</div>
                  <RadioGroupItem value="dark" id="dark" />
                </Label>
                <Label htmlFor="system" className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:bg-muted [&:has([data-state=checked])]:border-primary w-40">
                  <div className="flex items-center gap-2"><Monitor className="w-4 h-4" /> System</div>
                  <RadioGroupItem value="system" id="system" />
                </Label>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label className="text-base">Accent Color</Label>
              <div className="flex flex-wrap gap-4">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setThemeColor(theme.id as any)}
                    className={`group flex flex-col items-center gap-2`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${themeColor === theme.id ? 'border-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-background' : 'border-transparent'}`}>
                      <div className={`w-8 h-8 rounded-full ${theme.color}`} />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Layout & Typography */}
        <Card>
          <CardHeader>
            <CardTitle>Layout & Typography</CardTitle>
            <CardDescription>Adjust how information is presented.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            
            <div className="space-y-4">
              <Label className="text-base flex items-center gap-2">
                <Type className="w-4 h-4" /> Base Font Size
              </Label>
              <div className="px-2">
                <Slider 
                  value={[fontSizes[fontSize]]} 
                  max={100} 
                  step={33} 
                  onValueChange={(vals) => {
                    const val = vals[0] as keyof typeof fontValues;
                    if (fontValues[val]) setFontSize(fontValues[val]);
                  }}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2 font-mono">
                  <span>Small</span>
                  <span>Medium</span>
                  <span>Large</span>
                  <span>X-Large</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base">Navigation Style</Label>
              <RadioGroup 
                value={layout} 
                onValueChange={(val: any) => setLayout(val)}
                className="flex gap-4"
              >
                <Label htmlFor="sidebar" className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:bg-muted [&:has([data-state=checked])]:border-primary w-48">
                  <div className="flex items-center gap-2"><Sidebar className="w-4 h-4" /> Sidebar Nav</div>
                  <RadioGroupItem value="sidebar" id="sidebar" />
                </Label>
                <Label htmlFor="top-nav" className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:bg-muted [&:has([data-state=checked])]:border-primary w-48">
                  <div className="flex items-center gap-2"><Menu className="w-4 h-4" /> Top Nav</div>
                  <RadioGroupItem value="top-nav" id="top-nav" />
                </Label>
              </RadioGroup>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="space-y-1">
                <Label className="text-base">Focus Reading Mode</Label>
                <p className="text-sm text-muted-foreground">Hide all navigation chrome when reading articles.</p>
              </div>
              <Switch checked={readingMode} onCheckedChange={setReadingMode} />
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
