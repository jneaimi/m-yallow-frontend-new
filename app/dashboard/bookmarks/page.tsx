import { BookmarksClient } from './bookmarks-client';

export default function BookmarksPage() {
  // Server component doesn't need to do auth checks anymore
  // The AuthWrapper in the client component will handle authentication
  return <BookmarksClient />;
}
