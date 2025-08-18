import { usePlaybackData } from '@/stores/useEditorStore';
import { usePixelsPerFrame } from '@/stores/useTimelineStore';
import { useHotkeys } from 'react-hotkeys-hook';

const useEditorHotkeys = () => {
    const [_playbackData, setPlaybackData] = usePlaybackData();
    const [pixelsPerFrame, setPixelsPerFrame] = usePixelsPerFrame();

    useHotkeys('space', () => {
        setPlaybackData((prev) => ({
            ...prev,
            playing: !prev.playing
        }));
    });
};

export default useEditorHotkeys;