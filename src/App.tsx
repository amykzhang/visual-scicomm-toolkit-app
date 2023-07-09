import {
    Canvas,
    getUserData,
    TldrawEditor,
    TLInstance,
    useLocalSyncClient,
    useApp,
} from "@tldraw/tldraw";

import styled from "styled-components";
import "@tldraw/tldraw/editor.css";
import "@tldraw/tldraw/ui.css";

import { ElementsBar } from "./containers/ElementsBar";
import { UILayer } from "./components/Components";
import { ToolBar } from "./containers/ToolBar";
import { ActivityBar } from "./containers/ActivityBar";
import { ZoomBar } from "./containers/ZoomBar";
import { LogoBar } from "./containers/LogoBar";
import { BottomZone, TopZone } from "./styles/containers";

import activity_visual_strategies from "./activity/activity";

const instanceId = TLInstance.createCustomId("toolkit");
const activity = activity_visual_strategies;

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
    width: 100vw;
    height: 100vh;
    touch-action: none;
`;

export default function App() {
    const app = useApp();
    const userData = getUserData();
    const syncedStore = useLocalSyncClient({
        instanceId,
        userId: userData.id,
        universalPersistenceKey: "visscicomm",
        // config: myConfig // for custom config, see 3-custom-config
    });

    return (
        <AppContainer>
            <TldrawEditorContainer>
                <TldrawEditor
                    instanceId={instanceId}
                    userId={userData.id}
                    store={syncedStore}
                >
                    <UILayer>
                        <TopZone>
                            <LogoBar activity={activity} />
                            <ToolBar />
                        </TopZone>
                        <ActivityBar activity={activity} />
                        <ElementsBar activity={activity} />
                        <BottomZone>
                            <ZoomBar />
                        </BottomZone>
                    </UILayer>
                    <Canvas />
                </TldrawEditor>
            </TldrawEditorContainer>
        </AppContainer>
    );
}
