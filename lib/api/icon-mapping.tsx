import React from "react";
import {
  Heart,
  Briefcase,
  Utensils,
  Wrench,
  Palette,
  GraduationCap,
  Home,
  Leaf,
  Star,
  Settings,
  Landmark,
  ShoppingBag,
  Users,
  BookOpen,
  Coffee,
  Newspaper,
  Building2,
  Hammer,
  Zap,
  Store,
  Wind,
  FlaskConical,
  Truck,
  LampDesk,
  PaintBucket,
  Bug,
  Camera,
  Type,
  Warehouse,
  Flame,
  CircleDot,
  Brush,
  Drill,
  Bubbles,
  CarFront,
} from "lucide-react";

// Default icon mapping for known icon strings
export const iconMapping: Record<string, React.ReactNode> = {
  // Standard icons
  heart: <Heart className="h-6 w-6" />,
  briefcase: <Briefcase className="h-6 w-6" />,
  utensils: <Utensils className="h-6 w-6" />,
  wrench: <Wrench className="h-6 w-6" />,
  palette: <Palette className="h-6 w-6" />,
  "graduation-cap": <GraduationCap className="h-6 w-6" />,
  home: <Home className="h-6 w-6" />,
  leaf: <Leaf className="h-6 w-6" />,
  settings: <Settings className="h-6 w-6" />,
  landmark: <Landmark className="h-6 w-6" />,
  shopping: <ShoppingBag className="h-6 w-6" />,
  users: <Users className="h-6 w-6" />,
  book: <BookOpen className="h-6 w-6" />,
  coffee: <Coffee className="h-6 w-6" />,
  news: <Newspaper className="h-6 w-6" />,

  // Industrial & Construction Categories
  bricks: <Building2 className="h-6 w-6" />,
  broom: <Brush className="h-6 w-6" />,
  hammer: <Hammer className="h-6 w-6" />,
  zap: <Zap className="h-6 w-6" />,
  store: <Store className="h-6 w-6" />,
  wind: <Wind className="h-6 w-6" />,
  beaker: <FlaskConical className="h-6 w-6" />,
  truck: <Truck className="h-6 w-6" />,
  chair: <LampDesk className="h-6 w-6" />,
  paintbrush: <PaintBucket className="h-6 w-6" />,
  bug: <Bug className="h-6 w-6" />,
  camera: <Camera className="h-6 w-6" />,
  type: <Type className="h-6 w-6" />,
  anvil: <Hammer className="h-6 w-6" />,
  circleDot: <CircleDot className="h-6 w-6" />,
  warehouse: <Warehouse className="h-6 w-6" />,
  flame: <Flame className="h-6 w-6" />,
  tool: <Drill className="h-6 w-6" />,
  pipe: <Bubbles className="h-6 w-6" />,
  circle: <CarFront className="h-6 w-6" />,

  // Map API-provided test icons to React components
  "test-icon": <Star className="h-6 w-6" />,
  "test-icon-1": <Palette className="h-6 w-6" />,
};

/**
 * Function to get icon component by string identifier
 * @param iconName The name of the icon to retrieve
 * @returns React component for the requested icon or a default star icon
 */
export function getIconByName(iconName: string): React.ReactNode {
  return iconMapping[iconName] || <Star className="h-6 w-6" />; // Fallback to Star icon
}
