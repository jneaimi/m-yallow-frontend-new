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
}

export function SearchBar({ 
  className = "", 
  placeholder = "Search for providers...",
  initialValue = ""
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
          console.log("Auth details set for search:", {userId: user.id, hasToken: !!token});
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
      
      // Perform a direct API call with authentication
      if (authDetails.token && authDetails.userId) {
        console.log("Searching with authenticated user:", authDetails.userId);
        
        try {
          // Perform search via API with authentication
          const apiEndpoint = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/public/providers/search?query=${query}&limit=20`;
          
          const response = await fetch(apiEndpoint, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authDetails.token}`,
              'X-User-ID': authDetails.userId
            }
          });
          
          if (response.ok) {
            console.log("Authenticated search successful");
          } else {
            console.warn("Authenticated search failed:", response.status);
          }
        } catch (error) {
          console.error("Error performing authenticated search:", error);
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
