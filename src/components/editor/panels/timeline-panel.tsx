import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Panel, PanelHeader, PanelContent, PanelFooter } from "./panel";
import DraggableTimestamp from "../draggable-timestamp";
import { usePlaybackData, useProject } from "@/stores/useEditorStore";
import Project, { getProjectFPS, getProjectLength, getShortTimeStringFromFrame } from "@/types/Project";
import { Description } from "@/components/typography";
import useDrag from "@/hooks/useDrag";
import React from "react";
import { usePixelsPerFrame } from "@/stores/useTimelineStore";
import { HotkeysProvider } from "react-hotkeys-hook";
import { Slider } from "@/components/ui/slider";
import { ZoomInIcon, ZoomOutIcon } from "lucide-react";

const TIMELINE_OVERSHOOT = 2;

interface TimelineContextData {
    contentRef: HTMLDivElement | null;
    setContentRef: (node: HTMLDivElement | null) => void;
}

const TimelineContext = React.createContext<TimelineContextData | null>(null);

const useTimelineContext = () => {
    const value = React.useContext(TimelineContext);
    if (!value) throw new Error("TimelineContext is not defined");
    return value;
};

const usePlayheadDrag = () => {
    const [_playbackData, setPlaybackData] = usePlaybackData();
    const [pixelsPerFrame] = usePixelsPerFrame();
    const { mouseX, ref, dragging } = useDrag();
    const { contentRef } = useTimelineContext();

    React.useEffect(() => {
        if (!contentRef || !dragging) return;
        const rect = contentRef.getBoundingClientRect();
        const x = mouseX - rect.left;
        if (x < 0) return;

        setPlaybackData((prev) => ({
            ...prev,
            currentFrame: (contentRef.scrollLeft + x) / pixelsPerFrame
        }));
    }, [contentRef, mouseX, dragging, pixelsPerFrame]);

    React.useEffect(() => {
        if (!contentRef || !ref.current) return;
        const handleClick = (e: PointerEvent) => {
            if (e.button !== 0) return;
            const rect = contentRef.getBoundingClientRect();
            const x = e.clientX - rect.left;
            if (x < 0) return;

            setPlaybackData((prev) => ({
                ...prev,
                currentFrame: (contentRef.scrollLeft + x) / pixelsPerFrame
            }));
        };

        ref.current.addEventListener('pointerdown', handleClick);

        return () => {
            ref.current?.removeEventListener('pointerdown', handleClick);
        };
    }, [ref, contentRef, pixelsPerFrame]);

    return ref;
};

const Triangle = (props: React.ComponentProps<"svg">) => (
    <svg {...props} id="triangle" viewBox="0 0 100 100">
        <polygon points="50 15, 100 100, 0 100" />
    </svg>
);

const TimelineHeader = (props: React.ComponentProps<typeof PanelHeader>) => (
    <PanelHeader {...props} />
);

const TimelineLegend = (props: React.ComponentProps<typeof ResizablePanel>) => {
    return (
        <ResizablePanel {...props}>
            <TimelineHeader className="flex items-center justify-center">
                <DraggableTimestamp />
            </TimelineHeader>
        </ResizablePanel>
    );
};

const TimelinePlayheadRuler = () => {
    return (
        <div className="relative h-full w-full">
            <div className="absolute top-0 left-0 w-[2px] bg-sky-400 -translate-x-1/2 h-full" />
            <Triangle className="absolute top-0 left-0 w-4 h-4 fill-sky-400 -scale-100 -translate-x-1/2 -translate-y-1"/>
        </div>
    )
}

const TimelinePlayhead = () => {
    const [playbackData] = usePlaybackData();
    const [pixelsPerFrame] = usePixelsPerFrame();
    const ref = usePlayheadDrag();

    return (
        <div ref={ref as React.RefObject<HTMLDivElement>} className="absolute top-0 left-0 h-full w-4 cursor-ew-resize z-50 pt-6" style={{ transform: `translateX(${pixelsPerFrame * playbackData.currentFrame}px)` }}>
            <TimelinePlayheadRuler />
        </div>
    )
}

const TimelineTimestamps = ({
    project
}: {
    project: Project
}) => {
    const [pixelsPerFrame] = usePixelsPerFrame();
    const fps = getProjectFPS(project);
    const projectLength = getProjectLength(project);

    return (
        <div className="relative w-full h-full">
            {[...Array(projectLength + 1 + fps * TIMELINE_OVERSHOOT)].map((_e, i) => (
                <div key={i}>
                    <div className={i <= projectLength ? "bg-muted-foreground" : "bg-muted-foreground/60"} style={{ position: 'absolute', bottom: 0, left: i * pixelsPerFrame, width: 1, height: i % fps === 0 ? '35%' : (i % (fps / 2) === 0 ? '30%' : '15%') }}></div>
                    {i % fps === 0 && i <= projectLength && (
                        <Description className="select-none" style={{ position: 'absolute', bottom: '30%', left: `${i * pixelsPerFrame}px`, transform: i !== 0 ? `translateX(${i === projectLength ? '-100%' : '-45%'})` : '' }}>{getShortTimeStringFromFrame(project, i)}</Description>
                    )}
                </div>
            ))}
        </div>
    );
};

const MemoizedTimelineTimestamps = React.memo(TimelineTimestamps);

const TimelineHeaderAccessibleDrag = (props: React.ComponentProps<"div">) => {
    const ref = usePlayheadDrag();

    return (
        <div {...props} ref={ref as React.RefObject<HTMLDivElement>} />
    )
};

const TimelineContent = (props: React.ComponentProps<typeof ResizablePanel>) => {
    const [project] = useProject();
    const [pixelsPerFrame] = usePixelsPerFrame();
    const [contentRef, setContentRef] = React.useState<HTMLDivElement | null>(null);

    const value: TimelineContextData = {
        contentRef,
        setContentRef
    };

    return (
        <TimelineContext.Provider value={value}>
            <ResizablePanel {...props} className="relative w-full h-full flex flex-col overflow-auto justify-between">
                <div ref={setContentRef} className="relative overflow-auto mb-8 w-full h-full grow basis-0">
                    <TimelineHeaderAccessibleDrag className="sticky top-0">
                        <TimelineHeader className="overflow-hidden p-0" style={{ width: getProjectLength(project) * pixelsPerFrame + getProjectFPS(project) * 2 * pixelsPerFrame }}>
                            <MemoizedTimelineTimestamps project={project} />
                        </TimelineHeader>
                    </TimelineHeaderAccessibleDrag>
                    <TimelinePlayhead />
                </div>
                <PanelFooter className="absolute bottom-0 left-0 flex flex-row justify-end gap-2 basis-0">
                    <Description><ZoomOutIcon size={15} /></Description>
                    <Slider className="w-48" min={1} value={[3]} max={6} />
                    <Description><ZoomInIcon size={15} /></Description>
                </PanelFooter>
            </ResizablePanel>
        </TimelineContext.Provider>
    );
};

const TimelinePanel = () => {
    return (
        <HotkeysProvider initiallyActiveScopes={['timeline']}>
            <Panel className="pb-0">
                <PanelContent className="p-0 pb-0">
                    <ResizablePanelGroup direction="horizontal" className="h-full">
                        <TimelineLegend minSize={10} defaultSize={15} />
                        <ResizableHandle />
                        <TimelineContent minSize={10} defaultSize={85} />
                    </ResizablePanelGroup>
                </PanelContent>
            </Panel>
        </HotkeysProvider>
    )
};

export default TimelinePanel;