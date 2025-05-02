'use client';

import { useClerk } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export function ClerkManageAccountButton() {
  const { openUserProfile } = useClerk();

  return (
    <Button onClick={() => openUserProfile()}>
      Manage Account Settings
    </Button>
  );
}
