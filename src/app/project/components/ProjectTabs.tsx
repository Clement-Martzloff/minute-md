"use client";

import Sources from "@/src/app/project/components/Sources"; // Corrected import path
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
        {/* Add other tabs here in the future */}
      </TabsList>
      <TabsContent value="source">
        <Sources userId={userId} />
      </TabsContent>
      {/* Add content for other tabs here */}
    </Tabs>
  );
};

export default ProjectTabs;
