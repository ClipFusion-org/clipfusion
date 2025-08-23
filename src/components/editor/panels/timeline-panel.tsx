import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Panel, PanelHeader, PanelContent, PanelFooter } from "./panel";
import DraggableTimestamp from "../draggable-timestamp";
import { useEditorStore, usePlaybackData, useProject } from "@/stores/useEditorStore";
import Project, { getProjectFPS, getProjectLength, getShortTimeStringFromFrame, updateProjectSegment } from "@/types/Project";
import { Description } from "@/components/typography";
import useDrag from "@/hooks/useDrag";
import React from "react";
import { usePixelsPerFrame } from "@/stores/useTimelineStore";
import { HotkeysProvider } from "react-hotkeys-hook";
import { Slider } from "@/components/ui/slider";
import { MoveLeft, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Track from "@/types/Track";
import { clamp, cn, lerp } from "@/lib/utils";
import Segment from "@/types/Segment";
import { DndContext, useDroppable, useDraggable, UniqueIdentifier, DragOverlay, useDndMonitor, useDndContext } from '@dnd-kit/core';

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
    const [project] = useProject();
    const setPlaybackData = useEditorStore((state) => state.setPlaybackData);
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
            currentFrame: clamp((contentRef.scrollLeft + x) / pixelsPerFrame, 0, getProjectLength(project))
        }));
    }, [contentRef, mouseX, dragging, pixelsPerFrame, project]);

    React.useEffect(() => {
        if (!contentRef || !ref.current) return;
        const handleClick = (e: PointerEvent) => {
            if (e.button !== 0) return;
            const rect = contentRef.getBoundingClientRect();
            const x = e.clientX - rect.left;
            if (x < 0) return;

            setPlaybackData((prev) => ({
                ...prev,
                currentFrame: clamp((contentRef.scrollLeft + x) / pixelsPerFrame, 0, getProjectLength(project))
            }));
        };

        ref.current.addEventListener('pointerdown', handleClick);

        return () => {
            ref.current?.removeEventListener('pointerdown', handleClick);
        };
    }, [ref, contentRef, pixelsPerFrame, project]);

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

const TimelineTrackContainer = ({
    track,
    ...props
}: React.ComponentProps<"div"> & {
    track: Track
}) => (
    <div {...props} className={cn("bg-card shrink-0 rounded-md overflow-hidden", props.className)} style={{ ...props.style, height: `calc(var(--spacing) * 12)` }} />
);

const TimelineLegendTrack = ({
    trackIndex
}: {
    trackIndex: number
}) => {
    const [project] = useProject();
    const track = project.tracks[trackIndex];

    return (
        <TimelineTrackContainer track={track} className="w-full flex flex-row items-center">
            {project.tracks[trackIndex].name}
        </TimelineTrackContainer>
    )
};

const TimelineLegend = (props: React.ComponentProps<typeof ResizablePanel>) => {
    const [project] = useProject();

    return (
        <ResizablePanel {...props} className="relative w-full h-full">
            <TimelineHeader className="sticky top-0 flex items-center justify-center">
                <DraggableTimestamp />
            </TimelineHeader>
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center overflow-none gap-1 py-8">
                {project.tracks.map((track, i) => (
                    <TimelineLegendTrack key={track.uuid} trackIndex={i} />
                ))}
            </div>
        </ResizablePanel>
    );
};

const TimelinePlayheadRuler = () => {
    return (
        <div className="relative h-full w-full">
            <div className="absolute top-0 left-0 w-[2px] bg-sky-400 -translate-x-1/2 h-full" />
            <Triangle className="absolute top-0 left-0 w-4 h-4 fill-sky-400 -scale-100 -translate-x-1/2 -translate-y-1" />
        </div>
    )
}

const TimelinePlayhead = () => {
    const [playbackData] = usePlaybackData();
    const [pixelsPerFrame] = usePixelsPerFrame();
    const ref = usePlayheadDrag();

    return (
        <div ref={ref as React.RefObject<HTMLDivElement>} className="absolute top-0 left-0 h-full w-4 cursor-ew-resize z-50 pt-6" style={{ transform: `translateX(${pixelsPerFrame * Math.floor(playbackData.currentFrame)}px)` }}>
            <TimelinePlayheadRuler />
        </div>
    )
}

const useContentWidth = () => {
    const [project] = useProject();
    const { contentRef } = useTimelineContext();
    const [pixelsPerFrame] = usePixelsPerFrame();
    const projectLength = getProjectLength(project);
    const rect = contentRef?.getBoundingClientRect();
    const width = rect?.width ?? 0;
    const exactLength = projectLength * pixelsPerFrame + width / 4;
    return exactLength < width ? undefined : exactLength;
};

const TimelineTimestamps = ({
    pixelsPerFrame,
    fps,
    projectLength,
    contentWidth
}: {
    pixelsPerFrame: number,
    fps: number,
    projectLength: number,
    contentWidth: number | undefined
}) => {
    const { contentRef } = useTimelineContext();
    const fixReduction = (r: number) => {
        if (Math.floor(r % fps) === 0) return r;
        for (let i = 0; i < 5000; i++) {
            if (((r + i * 0.001) % fps) === 0) return r + i * 0.001;
        }
        return r;
    };
    const rect = contentRef?.getBoundingClientRect();
    const reduction = fixReduction(Math.min(1, +(pixelsPerFrame / (fps * 0.1)).toFixed(1)));
    const timestampsCount = Math.ceil(((contentWidth ?? rect?.width ?? 0) / pixelsPerFrame) * reduction);

    const expandTimeString = (value: number) => (
        `${value}`.length <= 1 ? `0${value}` : `${value}`
    );

    const optimizedGetTimeString = (frame: number): string => {
        const seconds = Math.floor(frame / fps);
        return `${expandTimeString(Math.floor(seconds / 3600))}:${expandTimeString(Math.floor(seconds / fps) % 60)}:${expandTimeString(seconds % 60)},${expandTimeString(Math.floor((frame % fps) / fps * 100))}`;
    };

    const optimizedGetShortTimeString = (frame: number): string => {
        const seconds = Math.floor(frame / fps);
        if (seconds <= 60) return `${seconds}s`;
        if (seconds <= 3600) return `${(Math.floor(seconds / fps) % 60)}:${seconds % 60}`;
        return optimizedGetTimeString(frame);
    };

    return (
        <div className="relative w-full h-full">
            {[...Array(Math.max(timestampsCount))].map((_e, i) => (
                <div key={i}>
                    <div className={Math.floor(i / reduction) <= projectLength ? "bg-muted-foreground" : "bg-muted-foreground opacity-50"} style={{ position: 'absolute', bottom: 0, left: i / reduction * pixelsPerFrame, width: 1, height: (Math.floor(i / reduction) % fps) < 1 / reduction && !((Math.floor((i - 1) / reduction) % fps) < 1 / reduction) || i === 0 ? '35%' : ((Math.floor(i / reduction) % (fps / 2)) < 1 / reduction && !((Math.floor((i - 1) / reduction) % (fps / 2)) < 1 / reduction) ? '30%' : '15%') }}></div>
                    {Math.floor((i / reduction) % fps) === 0 && Math.floor(i / reduction) <= projectLength && (
                        <Description className="select-none" style={{ position: 'absolute', bottom: '30%', left: `${Math.floor(i / reduction) * pixelsPerFrame}px`, transform: i !== 0 ? `translateX(${i === projectLength ? '-100%' : '-45%'})` : '' }}>{optimizedGetShortTimeString(Math.floor(i / reduction))}</Description>
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

const TimelineContentSegment = ({
    track,
    segment,
}: {
    track: Track,
    segment: Segment
}) => {
    const { contentRef } = React.useContext(TimelineContext) ?? { contentRef: undefined };
    const setProject = useEditorStore((state) => state.setProject);
    const [pixelsPerFrame] = usePixelsPerFrame();
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: segment.uuid,
        data: [track, segment]
    });
    const context = useDndContext();

    useDndMonitor({
        onDragMove: (e) => {
            requestAnimationFrame(() => {
                if (!contentRef) return;
                const rect = contentRef.getBoundingClientRect();
                const x = (e.active.rect.current.translated?.left || 0) - rect.left + contentRef.scrollLeft;
                if (x < 0) return;
                if (e.active.id === segment.uuid) {
                    setProject((prev) => updateProjectSegment(prev, track, {
                        ...segment,
                        start: x / pixelsPerFrame
                    }))
                }
            });
        }
    });
    const rect = contentRef?.getBoundingClientRect();

    return (
        <TimelineTrackContainer ref={setNodeRef} {...listeners} {...attributes} track={track} className="absolute" style={{ width: pixelsPerFrame * segment.length, transform: isDragging ? `translateX(${(contentRef?.scrollLeft ?? 0) + (context.active?.rect.current.translated?.left ?? 0) - (rect ? rect.left : 0)}px)` : undefined, left: isDragging ? 0 : `${Math.floor(segment.start) * pixelsPerFrame}px`, opacity: isDragging ? 0.5 : 1, zIndex: isDragging ? 10 : undefined }}>
            {!isDragging && (
                <p className="truncate">{track.name} {segment.uuid}</p>
            )}
        </TimelineTrackContainer>
    );
}

const TimelineContentTrack = ({
    trackIndex
}: {
    trackIndex: number
}) => {
    const [project] = useProject();
    const track = project.tracks[trackIndex];
    const { setNodeRef } = useDroppable({
        id: track.uuid
    });

    return (
        <TimelineTrackContainer ref={setNodeRef} track={track} className="relative w-full flex items-center justify-center bg-transparent">
            {track.segments.map((segment) =>
                <TimelineContentSegment key={segment.uuid} track={track} segment={segment} />
            )}
        </TimelineTrackContainer>
    )
}

const TimelineContentTracks = () => {
    const [project] = useProject();
    const { contentRef } = useTimelineContext();
    const [offsetY, setOffsetY] = React.useState(0);
    const contentWidth = useContentWidth();

    React.useEffect(() => {
        if (!contentRef) return;
        const onResize = () => {
            setOffsetY(contentRef.offsetHeight - contentRef.clientHeight);
        };

        onResize();
        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, [contentRef]);

    return (
        <div className="absolute top-0 left-0 flex flex-col items-center justify-center overflow-y-auto gap-1 min-w-full min-h-full" style={{ width: contentWidth, paddingTop: `calc(var(--spacing) * 8 + ${offsetY}px)` }}>
            {project.tracks.map((track, i) =>
                (<TimelineContentTrack key={track.uuid} trackIndex={i} />)
            )}
        </div>
    );
}

const TimelineContentHeaderFiller = () => {
    const contentWidth = useContentWidth();
    return (
        <div className="relative w-full">
            <TimelineHeader className="absolute top-0 left-0 p-0 min-w-full" style={{ width: contentWidth }} />
        </div>
    );
};

const TimelineContentTimestampsHeader = () => {
    const [project] = useProject();
    const [pixelsPerFrame] = usePixelsPerFrame();
    const contentWidth = useContentWidth();
    return (
        <TimelineHeader className="p-0 min-w-full overflow-hidden" style={{ width: contentWidth }}>
            <MemoizedTimelineTimestamps fps={getProjectFPS(project)} pixelsPerFrame={pixelsPerFrame} projectLength={getProjectLength(project)} contentWidth={contentWidth} />
        </TimelineHeader>
    );
}

const TimelineContentScaleControls = () => {
    const [pixelsPerFrame, setPixelsPerFrame] = usePixelsPerFrame();
    return (
        <div className="flex flex-row items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setPixelsPerFrame((prev) => prev - 0.1)}>
                <Description><ZoomOutIcon size={15} /></Description>
            </Button>
            <Slider className="w-48" min={2} value={[pixelsPerFrame * 10]} onValueChange={(value) => setPixelsPerFrame(value[0] / 10)} max={100} />
            <Button variant="ghost" size="icon" onClick={() => setPixelsPerFrame((prev) => prev + 0.1)}>
                <Description><ZoomInIcon size={15} /></Description>
            </Button>
        </div>
    );
}

const TimelineContent = (props: React.ComponentProps<typeof ResizablePanel>) => {
    const [contentRef, setContentRef] = React.useState<HTMLDivElement | null>(null);

    const value: TimelineContextData = {
        contentRef,
        setContentRef
    };

    return (
        <TimelineContext.Provider value={value}>
            <ResizablePanel {...props} className="relative w-full h-full flex flex-col overflow-auto justify-between">
                <TimelineContentHeaderFiller />
                <div ref={setContentRef} className="relative overflow-scroll scrollbar-thin mb-8 grow basis-0 z-50">
                    <TimelineContentTracks />
                    <TimelineHeaderAccessibleDrag className="sticky top-0 right-0">
                        <TimelineContentTimestampsHeader />
                    </TimelineHeaderAccessibleDrag>
                    <TimelinePlayhead />
                </div>
                <PanelFooter className="absolute bottom-0 left-0 flex flex-row justify-end gap-2 basis-0">
                    <TimelineContentScaleControls />
                </PanelFooter>
            </ResizablePanel>
        </TimelineContext.Provider>
    );
};

const TimelinePanel = () => {
    const [dragSegmentData, setDragSegmentData] = React.useState<[Track, Segment] | undefined>();

    return (
        <DndContext onDragStart={(e) => setDragSegmentData(e.active.data.current as [Track, Segment])} onDragEnd={() => setDragSegmentData(undefined)}>
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
            <DragOverlay zIndex={10}>
                {dragSegmentData && (
                    <TimelineContentSegment track={dragSegmentData[0]} segment={dragSegmentData[1]} />
                )}
            </DragOverlay>
        </DndContext>
    )
};

export default TimelinePanel;