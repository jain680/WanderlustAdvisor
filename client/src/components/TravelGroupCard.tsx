import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, IndianRupee, Users } from "lucide-react";
import type { TravelGroup } from "@shared/schema";

interface TravelGroupCardProps {
  group: TravelGroup;
}

export default function TravelGroupCard({ group }: TravelGroupCardProps) {
  const isOpen = group.status === "open" && group.currentMembers < group.maxMembers;
  const isFull = group.currentMembers >= group.maxMembers;

  return (
    <Card className="bg-muted/50 rounded-xl" data-testid={`card-travel-group-${group.id}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex -space-x-2">
              <img 
                src={group.organizerAvatar}
                alt={`${group.organizerName} - Group organizer`}
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                data-testid={`img-organizer-avatar-${group.id}`}
              />
              {group.currentMembers > 1 && (
                <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-white flex items-center justify-center text-primary text-sm font-medium" data-testid={`text-additional-members-${group.id}`}>
                  +{group.currentMembers - 1}
                </div>
              )}
            </div>
            <div>
              <h4 className="font-medium text-card-foreground" data-testid={`text-group-title-${group.id}`}>
                {group.title}
              </h4>
              <p className="text-muted-foreground text-sm" data-testid={`text-group-description-${group.id}`}>
                {group.description}
              </p>
            </div>
          </div>
          <Button 
            variant={isFull ? "outline" : isOpen ? "default" : "secondary"}
            size="sm"
            disabled={isFull}
            data-testid={`button-join-group-${group.id}`}
          >
            {isFull ? "Full" : isOpen ? "Join" : "Connect"}
          </Button>
        </div>
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <span className="flex items-center">
            <Calendar className="mr-1 h-3 w-3" />
            <span data-testid={`text-group-dates-${group.id}`}>{group.startDate}-{group.endDate}</span>
          </span>
          <span className="flex items-center capitalize">
            {group.activities[0] && (
              <>
                <span className="mr-1">
                  {group.activities[0] === 'trekking' && '🏔️'}
                  {group.activities[0] === 'beaches' && '🏖️'}
                  {group.activities[0] === 'adventure' && '🪂'}
                </span>
                <span data-testid={`text-group-activity-${group.id}`}>{group.activities[0]}</span>
              </>
            )}
          </span>
          <span className="flex items-center">
            <IndianRupee className="mr-1 h-3 w-3" />
            <span data-testid={`text-group-budget-${group.id}`}>₹{group.budget.toLocaleString()} budget</span>
          </span>
          <span className="flex items-center">
            <Users className="mr-1 h-3 w-3" />
            <span data-testid={`text-group-members-${group.id}`}>{group.currentMembers}/{group.maxMembers} members</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
