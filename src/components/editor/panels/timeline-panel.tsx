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
            <div className="absolute top-3 left-0 w-[2px] bg-sky-400 -translate-x-1/2" style={{ height: 'calc(100%)' }} />
            <div className="absolute top-2 left-0 w-3 h-3 bg-sky-400 -translate-x-1/2" />
            <Triangle className="absolute top-6 left-0 w-3 h-3 fill-sky-400 -scale-100 -translate-x-1/2 -translate-y-1" />
        </div>
    )
}

const TimelinePlayhead = () => {
    const { contentRef } = useTimelineContext();
    const [playbackData] = usePlaybackData();
    const [pixelsPerFrame] = usePixelsPerFrame();
    const [scrollX, setScrollX] = React.useState(0);
    const ref = usePlayheadDrag();

    React.useEffect(() => {
        if (!contentRef) return;

        const handleScroll = () => {
            setScrollX(contentRef.scrollLeft);
        };

        contentRef.addEventListener('scroll', handleScroll);

        return () => {
            contentRef.removeEventListener('scroll', handleScroll);
        };
    }, [contentRef]);

    return (
        <div ref={ref as React.RefObject<HTMLDivElement>} className="absolute top-0 h-full w-[20px] cursor-ew-resize z-50" style={{ left: pixelsPerFrame * playbackData.currentFrame - scrollX}}>
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
            {[...Array(projectLength + 1)].map((_e, i) => (
                <div key={i}>
                    <div className="bg-muted-foreground" style={{ position: 'absolute', bottom: 0, left: i * pixelsPerFrame, width: 1, height: i % fps === 0 ? '35%' : (i % (fps / 2) === 0 ? '30%' : '15%') }}></div>
                    {i % fps === 0 && (
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
            <ResizablePanel {...props} className="relative w-full h-full flex flex-col overflow-auto">
                <div ref={setContentRef} className="overflow-auto mb-8 w-full h-full">
                    <TimelineHeaderAccessibleDrag className="sticky top-0">
                        <TimelineHeader className="overflow-hidden p-0" style={{ width: getProjectLength(project) * pixelsPerFrame + getProjectFPS(project) * 2 * pixelsPerFrame }}>
                            <MemoizedTimelineTimestamps project={project} />
                        </TimelineHeader>
                    </TimelineHeaderAccessibleDrag>
                    <TimelinePlayhead />
                </div>
                <PanelFooter className="absolute bottom-0 left-0 flex flex-row justify-end gap-2">
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