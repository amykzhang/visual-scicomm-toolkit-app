import {
	Canvas,
	ContextMenu,
	getUserData,
	TldrawEditor,
	TldrawUi,
	TLInstance,
	useLocalSyncClient,
} from '@tldraw/tldraw'
import { ToolbarTop } from './components/ToolbarTop'
import '@tldraw/tldraw/editor.css'
import '@tldraw/tldraw/ui.css'

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

						<Canvas />
                        <ToolbarTop />
			</TldrawEditor>
		</div>
	)
}
