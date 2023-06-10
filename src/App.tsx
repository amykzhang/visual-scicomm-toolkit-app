import {
    Canvas,
    getUserData,
    TldrawEditor,
    TLInstance,
    useLocalSyncClient,
} from "@tldraw/tldraw";
import "@tldraw/tldraw/editor.css";
import "@tldraw/tldraw/ui.css";

import { ElementsMenu } from "./containers/ElementsMenu";
import { UILayer, TopContainer } from "./components/Components";
import { ToolBar } from "./components/ToolBar";
import { ActivityBar } from "./components/ActivityBar";
import activity1 from "./activity/activity";
import { Activity } from "./activity/activity";

const instanceId = TLInstance.createCustomId("toolkit");

export default function App() {
    const userData = getUserData();

    const syncedStore = useLocalSyncClient({
        instanceId,
        userId: userData.id,
        universalPersistenceKey: "visscicomm",
        // config: myConfig // for custom config, see 3-custom-config
    });

    return (
        <div className="tldraw__editor">
            <TldrawEditor
                instanceId={instanceId}
                userId={userData.id}
                store={syncedStore}
            >
                <UILayer>
                    <TopContainer>
                        <ToolBar />
                    </TopContainer>
                    <ActivityBar activity={activity1} />
                    <ElementsMenu />
                </UILayer>
                <Canvas />
            </TldrawEditor>
        </div>
    );
}
