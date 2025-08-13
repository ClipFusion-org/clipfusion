import { Description, Title } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import groupedColors from "@/constants/groupedColors";
import { useEditorStore } from "@/store/useEditorStore";
import { CheckIcon, DropletIcon } from "lucide-react";

const PreviewResolutionRatioText = ({
    previewRatio
}: {
    previewRatio: number
}) => (
    <p className="object-contain text-[12px]">{previewRatio === 1 ? "Full" : `1/${previewRatio}`}</p>
);

const RatioResolutionIcon = ({
    ratio,
    previewRatio
}: {
    ratio: number,
    previewRatio: number
}) => (
    <div className={`flex items-center justify-center border border-foreground aspect-[${ratio}] rounded-xs text-xs w-full h-auto`}>
        <PreviewResolutionRatioText previewRatio={previewRatio} />
    </div>
);

const PreviewResolutionVariant = ({
    previewRatio
}: {
    previewRatio: number
}) => {
    const { project, setProject } = useEditorStore();

    return (
        <Toggle pressed={(project?.previewRatio || 1) === previewRatio} onPressedChange={() => setProject(prev => ({ ...prev, previewRatio: previewRatio }))} className="size-9 p-2 flex grow-0 flex-row items-center justify-start w-full gap-1">
            <RatioResolutionIcon previewRatio={previewRatio} ratio={project?.ratio || 16 / 9} />
        </Toggle>
    )
}

const ResolutionPopover = () => {
    const { project } = useEditorStore();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="flex items-center justify-center text-sm p-[2px]">
                    <RatioResolutionIcon previewRatio={project?.previewRatio || 1} ratio={project?.ratio || 16 / 9} /> 
                </Button>
            </PopoverTrigger>
            <PopoverContent className="grid gap-0">
                <Title className="font-bold text-lg">Preview Resolution</Title>
                <Description>Changing preview resolution has no impact on final results</Description>
                <div className="flex flex-row items-center justify-center w-full px-2">
                    <PreviewResolutionVariant previewRatio={1} />
                    <PreviewResolutionVariant previewRatio={2} />
                    <PreviewResolutionVariant previewRatio={3} />
                    <PreviewResolutionVariant previewRatio={4} />
                    <PreviewResolutionVariant previewRatio={5} />
                </div>
            </PopoverContent>
        </Popover>
    )
}

const BackgroundPopover = () => {
    const { project, setProject } = useEditorStore();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                    <DropletIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="h-80 overflow-y-auto gap-2">
                <h3 className="font-bold text-lg">Background</h3>
                <div className="flex flex-col gap-2 overflow-y-auto">
                    {groupedColors.map((group) => (
                        <div key={group.name} className="flex flex-col gap-1">
                            <h4 className="font-semibold text-secondary-foreground">{group.name}</h4>
                            <div className="grid gap-2 grid-cols-4">
                                {group.colors.map((color) => (
                                    <Tooltip key={color.color}>
                                        <TooltipTrigger asChild>
                                            <div className="relative aspect-square h-auto overflow-hidden">
                                                <Button className="w-full h-full hover:opacity-60" style={{ backgroundColor: color.color }}
                                                    onClick={() => {
                                                        setProject({
                                                            ...(project || {}),
                                                            backgroundColor: color.color
                                                        });
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
    );
};

export const ProjectControls = () => {
    return (
        <div className="flex flex-row items-center justify-center gap-2">
            <ResolutionPopover />
            <BackgroundPopover />
        </div>
    );
};