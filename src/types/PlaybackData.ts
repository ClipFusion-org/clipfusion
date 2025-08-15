export interface PlaybackData {
    playing: boolean;
    currentFrame: number;
}

export const defaultPlaybackData: PlaybackData = {
    playing: false,
    currentFrame: 0
};