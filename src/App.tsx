import {
	Canvas,
	ContextMenu,
	getUserData,
	TldrawEditor,
	TldrawUi,
	TLInstance,
	useLocalSyncClient,
} from '@tldraw/tldraw'
import '@tldraw/tldraw/editor.css'
import '@tldraw/tldraw/ui.css'

import { Toolbar } from './components/Toolbar'
import { ElementsMenu } from './containers/ElementsMenu'

const instanceId = TLInstance.createCustomId('example')

export default function App() {
	const userData = getUserData()

	const syncedStore = useLocalSyncClient({
		instanceId,
		userId: userData.id,
		universalPersistenceKey: 'exploded-example',
		// config: myConfig // for custom config, see 3-custom-config
	})

	return (
		<div className="tldraw__editor">
			<TldrawEditor instanceId={instanceId} userId={userData.id} store={syncedStore} >
                {/* <TldrawUi> */}
                    {/* <ContextMenu> */}
                        <Canvas />
                        <Toolbar />
                        <ElementsMenu />
                    {/* </ContextMenu> */}
                {/* </TldrawUi> */}
			</TldrawEditor>
		</div>
	)
}
