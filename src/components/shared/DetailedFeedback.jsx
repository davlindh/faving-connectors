import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DetailedFeedback = ({ reviews }) => {
  const categories = ['Communication', 'Quality', 'Timeliness', 'Professionalism'];

  const averageScores = categories.reduce((acc, category) => {
    acc[category.toLowerCase()] = Math.round(
      reviews.reduce((sum, review) => sum + review[category.toLowerCase()], 0) / reviews.length
    );
    return acc;
  }, {});

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
              <span>{averageScores[category.toLowerCase()]}%</span>
            </div>
            <Progress value={averageScores[category.toLowerCase()]} className="w-full" />
          </div>
        ))}
        <ScrollArea className="h-64 mt-4">
          <h4 className="font-semibold mb-2">Reviews:</h4>
          {reviews.map((review, index) => (
            <Card key={index} className="mb-4 p-4">
              <div className="flex items-center mb-2">
                {review.reviewer ? (
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={review.reviewer.avatar_url} alt={review.reviewer.first_name} />
                    <AvatarFallback>{review.reviewer.first_name[0]}</AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                )}
                <span className="font-semibold">{review.reviewer ? `${review.reviewer.first_name} ${review.reviewer.last_name}` : 'Anonymous'}</span>
              </div>
              {categories.map((category) => (
                <div key={category} className="mb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{category}</span>
                    <span className="text-sm font-semibold">{review[category.toLowerCase()]}%</span>
                  </div>
                  <Progress value={review[category.toLowerCase()]} className="w-full h-1" />
                </div>
              ))}
              {review.comment && (
                <p className="text-sm mt-2">{review.comment}</p>
              )}
            </Card>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DetailedFeedback;