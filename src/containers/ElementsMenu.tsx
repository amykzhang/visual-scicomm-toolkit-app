import { useApp } from '@tldraw/tldraw'
import '@tldraw/tldraw/editor.css'
import { track } from 'signia-react'
import '../css/ElementsMenu.css'
import { TextTool } from '../components/TextTool'

export const ElementsMenu = track(() => {
	const app = useApp()

	return (
        <div className="custom-layout">
            <div className="elements-menu">
                <span className="h1">Elements</span>

                <div className="elements-section">
                    <span className="h2">Text</span>
                    <div className="elements-tools">
                        <TextTool />
                    </div>
                </div>

                <div className="elements-section">
                    <span className="h2">Lines</span>
                    <div className="elements-tools">
                        <button
                            className="custom-button"
                            data-isactive={app.currentToolId === 'draw'}
                            onClick={() => app.setSelectedTool('draw')}
                        >
                            ✏️ Draw
                        </button>
                    </div>
                    
                </div>
            </div>
        </div>
	)
})


