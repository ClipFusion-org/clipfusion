import { useEditorStore } from '@/stores/useEditorStore';
import { useHotkeys } from 'react-hotkeys-hook';

const useEditorHotkeys = () => {
    const setPlaybackData = useEditorStore((state) => state.setPlaybackData);

    useHotkeys('space', () => {
        setPlaybackData((prev) => ({
            ...prev,
            playing: !prev.playing
        }));
    });
};

export default useEditorHotkeys;