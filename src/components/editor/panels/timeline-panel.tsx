import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Panel, PanelHeader, PanelContent } from "./panel";
import DraggableTimestamp from "../draggable-timestamp";
import { useProject } from "@/stores/useEditorStore";
import { getProjectLength, getShortTimeStringFromFrame } from "@/types/Project";
import { Description } from "@/components/typography";

const PIXELS_PER_FRAME = 3;

const toPixels = (frames: number) => frames * PIXELS_PER_FRAME;

const TimelineHeader = (props: React.ComponentProps<typeof PanelHeader>) => (
    <PanelHeader {...props} />
)

const TimelineLegend = (props: React.ComponentProps<typeof ResizablePanel>) => {
    return (
        <ResizablePanel {...props}>
            <TimelineHeader className="flex items-center justify-center">
                <DraggableTimestamp />
            </TimelineHeader>
        </ResizablePanel>
    );
};

const TimelineContent = (props: React.ComponentProps<typeof ResizablePanel>) => {
    const [project] = useProject();
    const headerWidthPx = toPixels(getProjectLength(project));
    const TIMESTAMP_SPACING = PIXELS_PER_FRAME * 50;
    const timestampsCount = headerWidthPx / TIMESTAMP_SPACING;

    return (
        <ResizablePanel {...props}>
            <div className="relative w-full h-full overflow-auto">
                <TimelineHeader className="absolute top-0 left-0 overflow-hidden" style={{ width: `${headerWidthPx}px` }}>
                    <div className="relative w-full h-full">
                        {[...Array(timestampsCount + 1)].map((_e, i) => (
                            <Description key={i} style={{position: 'absolute', top: 0, left: i * TIMESTAMP_SPACING}}>{getShortTimeStringFromFrame(project, i / timestampsCount * getProjectLength(project))}</Description>
                        ))}
                        <Description className="absolute top-0 right-0">{getShortTimeStringFromFrame(project, getProjectLength(project))}</Description>
                    </div>
                </TimelineHeader>
            </div>
        </ResizablePanel>
    );
};

const TimelinePanel = () => {
    return (
        <Panel className="pb-0">
            <PanelContent className="p-0 pb-0">
                <ResizablePanelGroup direction="horizontal" className="h-full">
                    <TimelineLegend minSize={10} defaultSize={15} />
                    <ResizableHandle />
                    <TimelineContent minSize={10} defaultSize={85} />
                </ResizablePanelGroup>
            </PanelContent>
        </Panel>
    )
};

export default TimelinePanel;