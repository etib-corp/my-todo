"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TaskCard } from "./task-card";

export function TaskColumn({
  status,
  tasks,
}: {
  status: string;
  tasks: any[];
}) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <Card ref={setNodeRef}>
      <CardHeader>
        <h2 className="font-semibold capitalize">
          {status}
        </h2>
      </CardHeader>

      <CardContent className="space-y-3">
        <SortableContext
          items={tasks.map((task) => task.id)}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
            />
          ))}
        </SortableContext>
      </CardContent>
    </Card>
  );
}