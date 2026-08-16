import { User, MapPin, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProfileSidebarProps {
  activeTab: "info" | "address";
  onTabChange: (tab: "info" | "address") => void;
  onLogout: () => void;
}

export const ProfileSidebar = ({ activeTab, onTabChange, onLogout }: ProfileSidebarProps) => {
  return (
    <div className="flex flex-col w-full md:w-64 bg-card border border-border/60 rounded-xl p-4 gap-2">
      <div className="flex flex-col gap-1">
        <Button
          variant={activeTab === "info" ? "default" : "ghost"}
          onClick={() => onTabChange("info")}
          className={cn(
            "w-full justify-start gap-3 rounded-lg py-2.5 px-4 font-medium transition-colors cursor-pointer",
            activeTab === "info"
              ? "bg-brand text-white hover:bg-brand-hover"
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          <User className="w-4 h-4" />
          <span>Profile Info</span>
        </Button>
        <Button
          variant={activeTab === "address" ? "default" : "ghost"}
          onClick={() => onTabChange("address")}
          className={cn(
            "w-full justify-start gap-3 rounded-lg py-2.5 px-4 font-medium transition-colors cursor-pointer",
            activeTab === "address"
              ? "bg-brand text-white hover:bg-brand-hover"
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          <MapPin className="w-4 h-4" />
          <span>Manage Address</span>
        </Button>
      </div>

      <div className="border-t border-border/60 my-2" />

      <Button
        variant="ghost"
        onClick={onLogout}
        className="w-full justify-start gap-3 rounded-lg py-2.5 px-4 font-medium text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out</span>
      </Button>
    </div>
  );
};
