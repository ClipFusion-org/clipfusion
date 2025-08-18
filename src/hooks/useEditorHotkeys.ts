import { usePlaybackData } from '@/stores/useEditorStore';
import { useHotkeys } from 'react-hotkeys-hook';

const useEditorHotkeys = () => {
    const [_playbackData, setPlaybackData] = usePlaybackData();

    useHotkeys('space', () => {
        setPlaybackData((prev) => ({
            ...prev,
            playing: !prev.playing
        }));
    });
};

export default useEditorHotkeys;