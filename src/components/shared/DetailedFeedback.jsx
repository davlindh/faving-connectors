import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

const DetailedFeedback = ({ feedback }) => {
  const categories = ['Communication', 'Quality', 'Timeliness', 'Professionalism'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        {categories.map((category) => (
          <div key={category} className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">{category}</span>
              <span>{feedback[category.toLowerCase()]}%</span>
            </div>
            <Progress value={feedback[category.toLowerCase()]} className="w-full" />
          </div>
        ))}
        <ScrollArea className="h-40 mt-4">
          <h4 className="font-semibold mb-2">Comments:</h4>
          {feedback.comments.map((comment, index) => (
            <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
              <p className="text-sm">{comment}</p>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DetailedFeedback;