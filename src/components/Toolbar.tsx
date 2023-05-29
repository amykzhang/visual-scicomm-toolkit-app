import { useApp } from '@tldraw/tldraw'
import '@tldraw/tldraw/editor.css'
import { useEffect } from 'react'
import { track } from 'signia-react'
import '../css/Toolbar.css'

export const Toolbar = track(() => {
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
		<div className="custom-layout">
			<div className="custom-toolbar">
				<button
					className="custom-button"
					data-isactive={app.currentToolId === 'select'}
					onClick={() => app.setSelectedTool('select')}
				>
					Select
				</button>
                <button
					className="custom-button"
					data-isactive={app.currentToolId === 'hand'}
					onClick={() => app.setSelectedTool('hand')}
				>
					Pan
				</button>
                <button
					className="custom-button"
					/* WIP - Comment tool
                     data-isactive={app.currentToolId === 'comment'}
                      onClick={() => app.setSelectedTool('comment')} 

                      Create a comment view
                    */
				>
					Comment
				</button>
                <button
					className="custom-button"
					onClick={() => app.undo()}
				>
					Undo
				</button>
                <button
					className="custom-button"
					onClick={() => app.redo()}
				>
					Redo
				</button>
			</div>
		</div>
	)
})
