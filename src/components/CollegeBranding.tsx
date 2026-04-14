import { GraduationCap, MapPin } from "lucide-react";

interface Props {
  size?: "sm" | "lg";
}

const CollegeBranding = ({ size = "lg" }: Props) => {
  if (size === "sm") {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <GraduationCap className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium">MMU Bhawanipatna</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 animate-fade-in">
      <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
        <GraduationCap className="h-7 w-7 text-primary-foreground" />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-bold text-foreground">Maa Manikeshwari University</h2>
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
          <MapPin className="h-3 w-3" />
          Bhawanipatna, Kalahandi
        </p>
      </div>
    </div>
  );
};

export default CollegeBranding;
