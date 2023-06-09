import { useApp } from '@tldraw/tldraw'
import '@tldraw/tldraw/editor.css'
import { track } from 'signia-react'
import { TextTool } from '../components/TextTool'
import typography from '../typography/Typography';
import styled from 'styled-components';


const ElementsMenuContainer = styled.div`
    position: absolute;
    top: 5rem;
    right: 0px;
    height: calc(90vh - 5rem);
    width: 10rem;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 10px;
    gap: 8px;
    background-color: grey;
    flex-direction: column;
`

const ElementsSection = styled.div`
    pointer-events: all;
    /* padding: 4px 12px; */
    /* background: white; */
    /* border: none; */
    /* border-radius: 0px; */
`

const ElementsTool = styled.div`
    /* display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px; */
`

const Element = styled.div`
    pointer-events: all;
    background: white;
    border: none;
    border-radius: 0px;

    /* &[data-isactive='true'] {
    background-color: lightblue;
    } */
`

const ElementContainer = () => {
    return (
        <Element draggable />
    )
}

export const ElementsMenu = track(() => {
	const app = useApp()

	return (
            <ElementsMenuContainer>
                <typography.LargeText>Elements</typography.LargeText>

                <ElementsSection>
                    <typography.MediumText>Text</typography.MediumText>
                    <ElementsTool>
                        <TextTool />
                    </ElementsTool>
                </ElementsSection>

                <ElementsSection>
                <typography.MediumText>Lines</typography.MediumText>
                    <ElementsTool>
                        <Element
                            data-isactive={app.currentToolId === 'draw'}
                            onClick={() => app.setSelectedTool('draw')}
                        >
                            ✏️ Draw
                        </Element>
                    </ElementsTool>
                    
                </ElementsSection>
            </ElementsMenuContainer>
	)
})


