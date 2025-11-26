import { Badge } from "@/components/ui/badge";
import { BookingStatus } from "@/data/mockData";

interface StatusBadgeProps {
  status: BookingStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusColor = () => {
    switch (status) {
      case BookingStatus.PENDING:
        return "bg-muted text-muted-foreground hover:bg-muted";
      case BookingStatus.ASSIGNED:
        return "bg-primary text-primary-foreground hover:bg-primary";
      case BookingStatus.COMPLETED:
        return "bg-success text-success-foreground hover:bg-success";
      case BookingStatus.CANCELLED:
        return "bg-destructive text-destructive-foreground hover:bg-destructive";
      default:
        return "bg-muted text-muted-foreground hover:bg-muted";
    }
  };

  return (
    <Badge className={getStatusColor()}>
      {status}
    </Badge>
  );
};
