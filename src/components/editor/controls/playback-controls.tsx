import { Button } from "@/components/ui/button";
import { usePlaybackData, useProject } from "@/stores/useEditorStore";
import { getProjectFPS, getProjectLength } from "@/types/Project";
import { PauseIcon, PlayIcon, SkipBackIcon, SkipForwardIcon } from "lucide-react";
import React from "react";
import { useCallback } from "react";

const PlaybackControls = () => {
    const [project] = useProject();
    const [playbackData, setPlaybackData] = usePlaybackData();

    const togglePlaying = useCallback(() => {
        setPlaybackData((prev) => ({
            ...prev,
            playing: !prev.playing
        }));
    }, [setPlaybackData]);

    React.useEffect(() => {
        if (!project.uuid) return;

        const nextFrame = () => {
            if (!playbackData.playing) return;

            setPlaybackData((prev) => ({
                ...prev,
                currentFrame: prev.currentFrame + 1
            }));
        };

        const interval = setInterval(nextFrame, Math.floor(1000 / getProjectFPS(project)));

        return () => clearInterval(interval);
    }, [playbackData.playing]);

    return (
        <div className="flex flex-row items-center justify-center">
            <Button variant="ghost" size="icon" onClick={() => setPlaybackData((prev) => ({ ...prev, currentFrame: 0 }))}>
                <SkipBackIcon />
            </Button>

            <Button variant="ghost" size="icon" onClick={togglePlaying}>
                {playbackData.playing ? <PauseIcon /> : <PlayIcon />}
            </Button>

            <Button variant="ghost" size="icon" onClick={() => setPlaybackData((prev) => ({ ...prev, currentFrame: getProjectLength(project) }))}>
                <SkipForwardIcon />
            </Button>
        </div>
    )
};

export default PlaybackControls;