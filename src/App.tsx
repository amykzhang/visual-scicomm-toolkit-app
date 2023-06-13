import {
    Canvas,
    getUserData,
    TldrawEditor,
    TLInstance,
    useLocalSyncClient,
    // useApp,
} from "@tldraw/tldraw";

import { useState } from "react";
import styled from "styled-components";
import "@tldraw/tldraw/editor.css";
import "@tldraw/tldraw/ui.css";

import { ElementsMenu } from "./components/ElementsMenu";
import { UILayer } from "./components/Components";
import { ToolBar } from "./components/ToolBar";
import { ActivityBar } from "./components/ActivityBar";
import { ZoomBar } from "./components/ZoomBar";
import { TopZone } from "./styles/containers";
import { calculateZoom } from "./functions/ZoomManager";

import activity_visual_strategies from "./activity/activity";

const instanceId = TLInstance.createCustomId("toolkit");
const activity = activity_visual_strategies;

// const CanvasContainer = styled.div`
//     background-color: green;
//     touch-action: none;
// `;

const AppContainer = styled.div`
    position: fixed;
    inset: 0px;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const TldrawEditorContainer = styled.div`
    background-color: grey;
    border: 1px solid lightgrey;
    width: 1vw;
    height: 1vh;
    /* overflow: visible; */
    touch-action: none;
`;

export default function App() {
    // const app = useApp();
    const userData = getUserData();
    const syncedStore = useLocalSyncClient({
        instanceId,
        userId: userData.id,
        universalPersistenceKey: "visscicomm",
        // config: myConfig // for custom config, see 3-custom-config
    });

    const [zoom, setZoom] = useState(2);
    const { width: w, height: h } = calculateZoom(zoom);

    return (
        <AppContainer>
            <TldrawEditorContainer style={{ width: w, height: h }}>
                <TldrawEditor
                    instanceId={instanceId}
                    userId={userData.id}
                    store={syncedStore}
                >
                    <UILayer>
                        <TopZone>
                            <ToolBar />
                        </TopZone>
                        <ActivityBar activity={activity} />
                        <ElementsMenu activity={activity} />
                        <ZoomBar zoom={zoom} setZoom={setZoom} />
                    </UILayer>
                    <Canvas />
                </TldrawEditor>
            </TldrawEditorContainer>
        </AppContainer>
    );
}
