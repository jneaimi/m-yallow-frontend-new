'use client';

import { getIconByName } from '@/lib/api/icon-mapping';

interface CategoryIconProps {
  name: string;
  className?: string;
  size?: number;
}

export function CategoryIcon({ name, className = '', size = 16 }: CategoryIconProps) {
  // Get the icon component from the central mapping
  const iconComponent = getIconByName(name?.toLowerCase() || 'default');
  
  // Clone the icon with the new size and className props
  if (iconComponent && typeof iconComponent === 'object' && 'props' in iconComponent) {
    return {
      ...iconComponent,
      props: {
        ...iconComponent.props,
        className: className || iconComponent.props.className,
        size: size || iconComponent.props.size || 16
      }
    };
  }
  
  // Fallback
  return iconComponent;
}