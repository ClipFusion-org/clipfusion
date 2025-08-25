import { Entity } from "dexie";
import type EditorDB from "./EditorDB";
import Track, { generateTrack } from "./Track";
import Segment, { generateSegment } from "./Segment";

export default class Project extends Entity<EditorDB> {
    uuid!: string;
    origin!: string; // If the project was duplicated, origin will be equal to the UUID of original project
    title!: string;
    description!: string;
    creationDate!: number;
    editDate!: number;
    backgroundColor!: string;
    ratio!: string; // i.e '16:9', '19.5:9', '4:3'
    height!: number; // default is 1080p, width is derived from height using ratio
    previewRatio!: number; // default is 1, 2 means half of the resolution, 3, 4, 5 and so on
    fps!: number; // default is 30
    tracks!: Track[];
}

export const getProjectRatio = (project: Project): number => (
    typeof project.ratio === 'string' ? +project.ratio.split(":")[0] / +project.ratio.split(":")[1] : project.ratio
);

export const getProjectPreviewRatio = (project: Project): number => (
    project.previewRatio || 1
);

// returns project length in frames
export const getProjectLength = (project: Project): number => {
    let maxSegmentEnd = 0;
    if (!project.tracks) return 0;
    for (const track of project.tracks) {
        for (const segment of track.segments) {
            if (segment.start + segment.length > maxSegmentEnd) {
                maxSegmentEnd = segment.start + segment.length;
            }
        }
    }
    return Math.floor(maxSegmentEnd);
}

export const getProjectFPS = (project: Project): number => (
    project.fps || 30
);

export const getProjectResolutionString = (project: Project): string => (
    `${Math.floor(project.height * getProjectRatio(project))}x${Math.floor(project.height)}`
);

export const getProjectPreviewResolutionString = (project: Project): string => (
    `${Math.floor(project.height * getProjectRatio(project) / getProjectPreviewRatio(project))}x${Math.floor(project.height / getProjectPreviewRatio(project))}`
);

export const getProjectTracks = (project: Project): Track[] => (
    project.tracks || []
);

// converts '1' to '01'
// so timestamps look like '00:02:48' and not '0:2:48'
const expandTimeString = <T>(value: T) => (
    `${value}`.length <= 1 ? `0${value}` : `${value}`
);

export const getTimeStringFromFrame = (project: Project, frame: number): string => {
    const fps = getProjectFPS(project);
    const seconds = Math.floor(frame / fps);
    return `${expandTimeString(Math.floor(seconds / 3600))}:${expandTimeString(Math.floor(seconds / fps) % 60)}:${expandTimeString(seconds % 60)},${expandTimeString(Math.floor((frame % fps) / fps * 100))}`;
};

export const getShortTimeStringFromFrame = (project: Project, frame: number): string => {
    const fps = getProjectFPS(project);
    const seconds = Math.floor(frame / fps);
    if (seconds <= 60) return `${seconds}s`;
    if (seconds <= 3600) return `${(Math.floor(seconds / fps) % 60)}:${seconds % 60}`;
    return getTimeStringFromFrame(project, frame);
};

export const migrateProject = (project: Project): Project => {
    if (!project.tracks) {
        project.tracks = [];
        for (let i = 0; i < 3; i++) {
            project.tracks.push({
                ...generateTrack(),
                segments: [generateSegment()]
            });
        }
        console.log(project.tracks);
    }
    console.log(project);
    return project;
};

export const updateProjectSegment = (project: Project, targetTrack: Track, targetSegment: Segment): Project => {
    for (let trackIndex = 0; trackIndex < project.tracks.length; trackIndex++) {
        const track = project.tracks[trackIndex];
        if (track.uuid === targetTrack.uuid) {
            for (let segmentIndex = 0; segmentIndex < track.segments.length; segmentIndex++) {
                const segment = track.segments[segmentIndex];
                if (segment.uuid === targetSegment.uuid) {
                    project.tracks[trackIndex].segments[segmentIndex] = targetSegment;
                }
            }
        }
    }

    return project;
};

export const moveProjectSegment = (project: Project, previousTrack: Track, targetTrack: Track, targetSegment: Segment) => {
    let successfullyRemovedOldSegment = false;
    for (let trackIndex = 0; trackIndex < project.tracks.length; trackIndex++) {
        const track = project.tracks[trackIndex];
        if (track.uuid !== previousTrack.uuid) continue;
        for (let segmentIndex = 0; segmentIndex < track.segments.length; segmentIndex++) {
            const segment = track.segments[segmentIndex];
            if (segment.uuid !== targetSegment.uuid) continue;
            project.tracks[trackIndex].segments.splice(segmentIndex, 1);
            successfullyRemovedOldSegment = true;
            break;
        }
        if (successfullyRemovedOldSegment) break;
    }
    if (!successfullyRemovedOldSegment) return project;

    for (let trackIndex = 0; trackIndex < project.tracks.length; trackIndex++) {
        const track = project.tracks[trackIndex];
        if (track.uuid !== targetTrack.uuid) continue;
        track.segments.push(targetSegment);
        break;
    }

    return project;
}

export const defaultProject: Project = {
    uuid: '',
    origin: '',
    title: 'New ClipFusion Project',
    description: '',
    creationDate: 0,
    editDate: 0,
    backgroundColor: '#000000',
    ratio: '16:9',
    height: 1080,
    previewRatio: 1,
    fps: 30
} as Project;