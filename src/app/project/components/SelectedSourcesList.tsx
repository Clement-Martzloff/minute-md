"use client";

import { useSourcesStore } from "@/src/app/project/store/useSourcesStore";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Trash2 } from "lucide-react";

function SelectedSourcesList() {
  const sources = useSourcesStore((store) => store.sources);
  const removeSource = useSourcesStore((store) => store.removeSource);
  const toggleSource = useSourcesStore((store) => store.toggleSource);
  const clearSources = useSourcesStore((store) => store.clearSources);

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle>Selected Sources</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {sources.length === 0 ? (
          <p className="text-center text-gray-500">No sources selected yet.</p>
        ) : (
          <div className="space-y-4">
            {sources.map((source) => (
              <div
                key={source.id}
                className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center space-x-3 flex-grow pr-2">
                  <Checkbox
                    id={`source-${source.id}`}
                    checked={source.selected}
                    onCheckedChange={() => toggleSource(source.id)}
                  />
                  <label
                    htmlFor={`source-${source.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-grow truncate"
                  >
                    {source.name} ({source.mimeType})
                  </label>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSource(source.id)}
                  className="flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="pt-4 border-t mt-4">
              <Button
                variant="outline"
                onClick={clearSources}
                disabled={sources.length === 0}
                className="w-full"
              >
                Clear All Sources
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SelectedSourcesList;
