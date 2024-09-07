import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MessageSquare, Users } from 'lucide-react';

const CommunitySection = () => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold mb-2">Community</h3>
      <Link to="/find-profiles" className="flex items-center text-sm hover:text-primary transition-colors">
        <Search className="mr-2 h-4 w-4" />
        Find Profiles
      </Link>
      <Link to="/messages" className="flex items-center text-sm hover:text-primary transition-colors">
        <MessageSquare className="mr-2 h-4 w-4" />
        Messages
      </Link>
      <Link to="/community-forums" className="flex items-center text-sm hover:text-primary transition-colors">
        <Users className="mr-2 h-4 w-4" />
        Community Forums
      </Link>
    </div>
  );
};

export default CommunitySection;