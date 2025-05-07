"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth, useUser } from "@clerk/nextjs";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  initialValue?: string;
  prefetch?: boolean; // Add option to control prefetching behavior
}

export function SearchBar({ 
  className = "", 
  placeholder = "Search for providers...",
  initialValue = "",
  prefetch = false // Default to no prefetching to avoid double fetches
}: SearchBarProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [authDetails, setAuthDetails] = useState<{token: string | null, userId: string | null}>({
    token: null, 
    userId: null
  });
  
  // Get authentication details when component mounts or auth state changes
  useEffect(() => {
    const fetchAuthDetails = async () => {
      if (isSignedIn && user) {
        try {
          const token = await getToken();
          setAuthDetails({
            token,
            userId: user.id
          });
        } catch (error) {
          console.error("Error getting auth token:", error);
        }
      } else {
        setAuthDetails({token: null, userId: null});
      }
    };
    
    fetchAuthDetails();
  }, [isSignedIn, user, getToken]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const query = encodeURIComponent(searchTerm.trim());
      
      // Track search activity for authenticated users
      if (authDetails.token && authDetails.userId) {
        try {
          // Import the API service dynamically
          const { trackSearchActivity } = await import('@/services/api');
          
          console.log("Tracking search activity for user:", authDetails.userId);
          
          // Fire and forget - no need to await
          trackSearchActivity({
            query: searchTerm.trim(),
            token: authDetails.token,
            userId: authDetails.userId
          });
        } catch (error) {
          // Log error but continue with navigation
          console.error("Error tracking search activity:", error);
        }
      } else {
        console.log("Searching as anonymous user");
      }
      
      // Navigate to search results page
      router.push(`/providers/search?q=${query}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex w-full ${className}`}>
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-20"
          aria-label="Search providers"
        />
      </div>
      <Button 
        type="submit" 
        className="absolute right-0 rounded-l-none"
        aria-label="Search"
      >
        Search
      </Button>
    </form>
  );
}
