import { Card, CardContent } from "@/components/ui/card";

interface ActivityCardProps {
  title: string;
  description: string;
  imageUrl: string;
  icon: string;
  destinationCount: number;
  onClick?: () => void;
}

export default function ActivityCard({ 
  title, 
  description, 
  imageUrl, 
  icon, 
  destinationCount,
  onClick 
}: ActivityCardProps) {
  return (
    <Card 
      className="activity-card overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl"
      onClick={onClick}
      data-testid={`card-activity-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div 
        className="h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <CardContent className="p-6">
        <div className="flex items-center mb-3">
          <span className="text-primary text-2xl mr-3">{icon}</span>
          <h3 className="font-semibold text-lg text-card-foreground" data-testid={`text-activity-title-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            {title}
          </h3>
        </div>
        <p className="text-muted-foreground mb-4" data-testid={`text-activity-description-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {description}
        </p>
        <div className="flex items-center text-sm text-muted-foreground">
          <span className="bg-muted px-2 py-1 rounded-full" data-testid={`text-activity-count-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            {destinationCount.toLocaleString()} destinations
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
