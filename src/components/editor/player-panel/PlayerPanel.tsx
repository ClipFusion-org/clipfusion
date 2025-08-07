import { Panel, PanelContent, PanelTitle } from "../panel";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export const PlayerPanel = () => {
    return (
        <Panel>
            <PanelTitle>Player</PanelTitle>
            <PanelContent className="p-0 flex flex-col items-center justify-between">
                <TransformWrapper limitToBounds={true}>
                    <TransformComponent>
                        <canvas id="rendering-canvas" className="bg-border object-contain flex items-center justify-center" width="640" height="480"/>
                    </TransformComponent>
                </TransformWrapper>
                <div className="flex shrink-0 flex-row justify-between items-center w-full h-16">
                    Hello!
                </div>
            </PanelContent>
        </Panel>
    )
};