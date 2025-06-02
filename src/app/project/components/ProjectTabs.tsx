"use client";

"use client";

import Sources from "@/src/app/project/components/Sources";
import SummarizationView from "@/src/app/project/components/SummarizationView"; // Import the new component
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import React from "react";

interface ProjectTabsProps {
  userId: string;
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ userId }) => {
  return (
    <Tabs defaultValue="source" className="w-full">
      <TabsList>
        <TabsTrigger value="source">Source</TabsTrigger>
        <TabsTrigger value="summarize">Summarize</TabsTrigger>{" "}
        {/* Add new tab trigger */}
      </TabsList>
      <TabsContent value="source">
        <Sources userId={userId} />
      </TabsContent>
      <TabsContent value="summarize">
        {" "}
        {/* Add new tab content */}
        <SummarizationView /> {/* Render the new component */}
      </TabsContent>
    </Tabs>
  );
};

export default ProjectTabs;
