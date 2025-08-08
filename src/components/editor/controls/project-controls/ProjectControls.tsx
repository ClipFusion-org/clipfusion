import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import groupedColors from "@/constants/groupedColors";
import { useEditorStore } from "@/store/useEditorStore";
import Project from "@/types/Project";
import { CheckIcon, DropletIcon } from "lucide-react";

export const ProjectControls = () => {
    const { project, setProject } = useEditorStore();

    return (
        <div className="flex flex-row items-center justify-center">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <DropletIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="h-80 overflow-y-auto">
                    <h3 className="font-bold text-lg">Background Color</h3>
                    <div className="flex flex-col gap-2 overflow-y-auto">
                        {groupedColors.map((group) => (
                            <div key={group.name} className="flex flex-col gap-1">
                                <h3 className="font-semibold">{group.name}</h3>
                                <div className="grid gap-2 grid-cols-4">
                                    {group.colors.map((color) => (
                                        <Tooltip key={color.color}>
                                            <TooltipTrigger asChild>
                                                <div className="relative aspect-square h-auto">
                                                    <Button className="w-full h-full hover:opacity-60" style={{ backgroundColor: color.color }}
                                                        onClick={() => {
                                                            setProject({
                                                                ...project,
                                                                backgroundColor: color.color
                                                            } as Project);
                                                        }}
                                                    />
                                                    {project?.backgroundColor == color.color && (
                                                        <div className="absolute top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center">
                                                            <CheckIcon />
                                                        </div>
                                                    )}
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {color.name}
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};