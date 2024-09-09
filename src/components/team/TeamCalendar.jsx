import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useTeamEvents, useCreateTeamEvent, useDeleteTeamEvent } from '@/integrations/supabase/hooks/team_events';
import { toast } from 'sonner';

const TeamCalendar = ({ teamId }) => {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const { data: teamEvents, isLoading, error } = useTeamEvents(teamId);
  const createTeamEvent = useCreateTeamEvent();
  const deleteTeamEvent = useDeleteTeamEvent();

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const handleAddEvent = async () => {
    if (!newEventTitle.trim()) {
      toast.error('Event title cannot be empty');
      return;
    }

    try {
      await createTeamEvent.mutateAsync({
        team_id: teamId,
        title: newEventTitle,
        date: selectedDay.toISOString(),
      });
      setNewEventTitle('');
      setIsAddEventDialogOpen(false);
      toast.success('Event added successfully');
    } catch (error) {
      toast.error('Failed to add event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteTeamEvent.mutateAsync(eventId);
      toast.success('Event deleted successfully');
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  if (isLoading) return <div>Loading team calendar...</div>;
  if (error) return <div>Error loading team calendar: {error.message}</div>;

  const eventDays = teamEvents?.reduce((acc, event) => {
    const date = new Date(event.date);
    acc[date.toDateString()] = event;
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex">
          <div className="w-1/2">
            <DayPicker
              mode="single"
              selected={selectedDay}
              onSelect={setSelectedDay}
              modifiers={{
                hasEvent: (date) => date.toDateString() in eventDays,
              }}
              modifiersStyles={{
                hasEvent: { backgroundColor: '#e0f2fe' },
              }}
            />
          </div>
          <div className="w-1/2 pl-4">
            <h3 className="text-lg font-semibold mb-2">
              Events for {format(selectedDay, 'MMMM d, yyyy')}
            </h3>
            {eventDays[selectedDay.toDateString()] ? (
              <div className="mb-4">
                <p>{eventDays[selectedDay.toDateString()].title}</p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteEvent(eventDays[selectedDay.toDateString()].id)}
                >
                  Delete Event
                </Button>
              </div>
            ) : (
              <p>No events scheduled for this day.</p>
            )}
            <Dialog open={isAddEventDialogOpen} onOpenChange={setIsAddEventDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4">Add Event</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                </DialogHeader>
                <Input
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="Enter event title"
                />
                <DialogFooter>
                  <Button onClick={handleAddEvent}>Add Event</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCalendar;