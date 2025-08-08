import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/useEditorStore";
import { PauseIcon, PlayIcon } from "lucide-react";
import { useCallback } from "react";

export const PlaybackControls = () => {
    const { playbackData, setPlaybackData } = useEditorStore();

    const togglePlaying = useCallback(() => {
        setPlaybackData({
            playing: !playbackData.playing
        });
    }, [playbackData, setPlaybackData]);

    return (
        <div className="flex flex-row items-center justify-center">
            <Button variant="ghost" size="icon" onClick={togglePlaying}>
                {playbackData.playing ? <PauseIcon /> : <PlayIcon />}
            </Button>
        </div>
    )
};