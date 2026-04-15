import React from "react";
import { Link, useLocation } from "wouter";
import { useCustomization } from "@/lib/customization-context";
import { BookOpen, Compass, Layers, Settings, Menu, X, BookText, FlaskConical, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Overview", icon: Compass },
  { href: "/topics", label: "Topics", icon: Layers },
  { href: "/articles", label: "Articles", icon: BookOpen },
  { href: "/training", label: "Training Lab", icon: FlaskConical },
  { href: "/datasets", label: "Datasets", icon: Database },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { layout, readingMode } = useCustomization();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  // If reading mode is active, minimal layout
  if (readingMode && location.startsWith("/articles/")) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <header className="sticky top-0 z-10 p-4 bg-background/80 backdrop-blur-md border-b border-border/40 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookText className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm">Focus Mode</span>
          </div>
          <Link href="/settings" className="text-sm text-muted-foreground hover:text-foreground">
            Exit Focus Mode
          </Link>
        </header>
        <main className="max-w-4xl mx-auto px-6 py-12">
          {children}
        </main>
      </div>
    );
  }

  const isSidebar = layout === "sidebar";

  return (
    <div className={`min-h-screen bg-background text-foreground flex ${isSidebar ? "flex-col md:flex-row" : "flex-col"}`}>
      {/* Sidebar Navigation */}
      {isSidebar && (
        <>
          <div className="md:hidden sticky top-0 z-20 flex items-center justify-between p-4 border-b border-border bg-background">
            <Link href="/" className="font-bold text-lg flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground">
                <BookText className="w-4 h-4" />
              </div>
              AI Training Guide
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
          <aside className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-64 border-r border-border bg-sidebar/50 backdrop-blur shrink-0 md:sticky md:top-0 md:h-screen p-4 gap-6`}>
            <div className="hidden md:flex items-center gap-3 px-2 py-4">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground">
                <BookText className="w-4 h-4" />
              </div>
              <span className="font-bold tracking-tight">AI Training</span>
            </div>
            <nav className="flex flex-col gap-1 flex-1">
              {navItems.map((item) => {
                const active = location === item.href || (item.href !== "/" && location.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"}`}>
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto px-3 py-4 text-xs text-muted-foreground border-t border-sidebar-border">
              Advanced knowledge hub
            </div>
          </aside>
        </>
      )}

      {/* Top Navigation */}
      {!isSidebar && (
        <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground">
                <BookText className="w-4 h-4" />
              </div>
              <span className="hidden sm:inline">AI Training Guide</span>
            </Link>
            
            <div className="flex md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>

            <nav className={`${mobileMenuOpen ? 'absolute top-16 left-0 w-full bg-background border-b border-border p-4 flex flex-col gap-2' : 'hidden'} md:static md:flex md:flex-row md:items-center md:gap-6 md:p-0 md:border-0 md:bg-transparent`}>
              {navItems.map((item) => {
                const active = location === item.href || (item.href !== "/" && location.startsWith(item.href));
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className={`text-sm font-medium transition-colors ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>
      )}

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
