import { Button } from "@/components/ui/button";
import { usePlaybackData, useProject } from "@/stores/useEditorStore";
import { getProjectLength } from "@/types/Project";
import { PauseIcon, PlayIcon, SkipBackIcon, SkipForwardIcon } from "lucide-react";
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