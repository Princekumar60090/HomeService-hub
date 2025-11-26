import { Star, MapPin, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Staff } from "@/data/mockData";

interface StaffCardProps {
  staff: Staff;
}

export const StaffCard = ({ staff }: StaffCardProps) => {
  return (
    <Card className="hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={staff.profilePicture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"}
              alt={staff.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-primary/10"
            />
            {staff.rating >= 4.5 && (
              <div className="absolute -bottom-2 -right-2 bg-accent text-accent-foreground rounded-full p-1">
                <Star className="h-4 w-4 fill-current" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground">{staff.name}</h3>
            
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                <Briefcase className="h-3 w-3 mr-1" />
                {staff.category}
              </Badge>
              <span className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                {staff.city}
              </span>
            </div>

            <div className="flex items-center gap-1 mt-2">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span className="font-semibold text-foreground">{staff.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({staff.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
