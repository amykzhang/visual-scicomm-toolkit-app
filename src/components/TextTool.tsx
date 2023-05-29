import { useApp } from '@tldraw/tldraw'
import '@tldraw/tldraw/editor.css'
import { useEffect } from 'react'
import { track } from 'signia-react'
import '../css/ElementsMenu.css'

export const TextTool = track(() => {
	const app = useApp()

	useEffect(() => {
		const handleKeyUp = (e: KeyboardEvent) => {
			switch (e.key) {
				case 'Delete':
				case 'Backspace': {
					app.deleteShapes()
				}
			}
		}

		window.addEventListener('keyup', handleKeyUp)
		return () => {
			window.removeEventListener('keyup', handleKeyUp)
		}
	})

	return (
		<div className="text-box-border">
			<button
					className="text-box-button"
					data-isactive={app.currentToolId === 'text'}
					onClick={() => app.setSelectedTool('text')}
            >
            Text Box
            </button>
		</div>
	)
})
