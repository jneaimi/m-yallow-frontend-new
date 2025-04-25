import { Heart, Briefcase, Utensils, Wrench, Palette, GraduationCap, Home, Leaf } from "lucide-react";

export const categoryIcons = {
  health: <Heart className="h-6 w-6" />,
  business: <Briefcase className="h-6 w-6" />,
  food: <Utensils className="h-6 w-6" />,
  services: <Wrench className="h-6 w-6" />,
  creative: <Palette className="h-6 w-6" />,
  education: <GraduationCap className="h-6 w-6" />,
  home: <Home className="h-6 w-6" />,
  environment: <Leaf className="h-6 w-6" />,
};

export const featuredCategories = [
  {
    id: "health",
    name: "Health & Wellness",
    icon: categoryIcons.health,
    description: "Find providers for physical and mental wellbeing"
  },
  {
    id: "business",
    name: "Business Services",
    icon: categoryIcons.business,
    description: "Professional services for your business needs"
  },
  {
    id: "food",
    name: "Food & Dining",
    icon: categoryIcons.food,
    description: "Restaurants, catering, and food services"
  },
  {
    id: "services",
    name: "Home Services",
    icon: categoryIcons.home,
    description: "Maintenance, repair, and improvement services"
  },
  {
    id: "creative",
    name: "Creative & Design",
    icon: categoryIcons.creative,
    description: "Graphic design, photography, and creative arts"
  },
  {
    id: "education",
    name: "Education & Training",
    icon: categoryIcons.education,
    description: "Learning resources and educational services"
  },
  {
    id: "environment",
    name: "Environmental",
    icon: categoryIcons.environment,
    description: "Eco-friendly and sustainable services"
  },
  {
    id: "technical",
    name: "Technical Support",
    icon: categoryIcons.services,
    description: "IT services and technical assistance"
  }
];
