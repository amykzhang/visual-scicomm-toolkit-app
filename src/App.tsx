import {
	Canvas,
	ContextMenu,
	getUserData,
	TldrawEditor,
	TldrawUi,
	TLInstance,
	useLocalSyncClient,
} from '@tldraw/tldraw'
// import '@tldraw/tldraw/editor.css'
// import '@tldraw/tldraw/ui.css'

import { Toolbar } from './components/Toolbar'
import { ElementsMenu } from './containers/ElementsMenu'
import { UILayer, TopContainer } from './components/Components'

const instanceId = TLInstance.createCustomId('toolkit')

export default function App() {
	const userData = getUserData()

	const syncedStore = useLocalSyncClient({
		instanceId,
		userId: userData.id,
		universalPersistenceKey: 'visscicomm',
		// config: myConfig // for custom config, see 3-custom-config
	})

	return (
		<div className="tldraw__editor">
			<TldrawEditor instanceId={instanceId} userId={userData.id} store={syncedStore} >
                <UILayer>
                    <TopContainer>
                        <Toolbar />
                    </TopContainer>
                    <ElementsMenu />
                </UILayer>
                <Canvas />
			</TldrawEditor>
		</div>
	)
}
