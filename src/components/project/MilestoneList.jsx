import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from 'date-fns';

const MilestoneList = ({ milestones, onEdit, onDelete, onReorder, onToggleComplete }) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(milestones);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updates = items.map((item, index) => ({
      id: item.id,
      order: index,
    }));

    onReorder(updates);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="milestones">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {milestones.map((milestone, index) => (
              <Draggable key={milestone.id} draggableId={milestone.id.toString()} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="flex items-center justify-between mb-4 p-4 bg-gray-100 rounded-lg"
                  >
                    <div className="flex items-center">
                      <Checkbox
                        checked={milestone.is_completed}
                        onCheckedChange={() => onToggleComplete(milestone)}
                        className="mr-4"
                      />
                      <div>
                        <h3 className={`font-semibold ${milestone.is_completed ? 'line-through text-gray-500' : ''}`}>
                          {milestone.title}
                        </h3>
                        <p className="text-sm text-gray-600">{milestone.description}</p>
                        <p className="text-xs text-gray-500">Due: {format(new Date(milestone.due_date), 'PPP')}</p>
                      </div>
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => onEdit(milestone)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(milestone.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default MilestoneList;