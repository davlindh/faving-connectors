import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from 'lucide-react';

const ApplicationForm = ({ applicationText, setApplicationText, onSubmit, isLoggedIn }) => {
  return (
    <div className="w-full space-y-4">
      <Textarea
        placeholder="Why are you interested in this project? Describe your relevant skills and experience."
        value={applicationText}
        onChange={(e) => setApplicationText(e.target.value)}
        rows={4}
      />
      <Button className="w-full" onClick={onSubmit} disabled={!isLoggedIn}>
        <Send className="mr-2 h-4 w-4" />
        {isLoggedIn ? 'Apply for Project' : 'Log in to Apply'}
      </Button>
    </div>
  );
};

export default ApplicationForm;