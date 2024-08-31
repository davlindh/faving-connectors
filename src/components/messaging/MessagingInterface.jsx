import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MessagingInterface = () => {
  return (
    <div className="flex h-[600px]">
      <div className="w-1/3 border-r">
        <h2 className="text-xl font-semibold p-4">Conversations</h2>
        {/* TODO: Add conversation list */}
      </div>
      <div className="w-2/3 flex flex-col">
        <Card className="flex-grow">
          <CardHeader>
            <CardTitle>Chat with John Doe</CardTitle>
          </CardHeader>
          <CardContent className="h-[450px] overflow-y-auto">
            {/* TODO: Add chat messages */}
          </CardContent>
        </Card>
        <div className="p-4 flex">
          <Input className="flex-grow mr-2" placeholder="Type a message..." />
          <Button>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default MessagingInterface;