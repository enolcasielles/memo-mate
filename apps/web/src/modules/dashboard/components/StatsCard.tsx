import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/base/card";
import { Button } from "@/core/components/base/button";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  actionUrl?: string;
  actionText?: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  actionUrl,
  actionText 
}: StatsCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300">
          <Icon className="h-4 w-4 text-blue-500 group-hover:text-white transition-colors duration-300" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        {actionUrl && actionText && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-4 w-full justify-between hover:bg-blue-50"
            asChild
          >
            <Link href={actionUrl}>
              {actionText}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
} 