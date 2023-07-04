import { FC, useState } from "react";
import { useApp } from "@tldraw/tldraw";
import "@tldraw/tldraw/editor.css";
import { track } from "signia-react";
import { TextTool } from "./TextTool";
import typography from "../styles/typography";
import styled from "styled-components";
import { Activity } from "../activity/activity";
import { SideBar, SideBarContent, SideBarToggle } from "../styles/containers";
import { ReactComponent as LeftArrow } from "../assets/arrowhead-left.svg";
import { ReactComponent as RightArrow } from "../assets/arrowhead-right.svg";

const ElementsBarContainer = styled(SideBar)`
    right: 0;
`;

const ElementsMenuContainer = styled(SideBarContent)`
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 10px;
    gap: 8px;
    flex-direction: column;

    border-radius: 0px 0px 0px 5px;
`;

const ElementsSection = styled.div`
    pointer-events: all;
`;

const ElementsTool = styled.div``;

const Element = styled.div`
    pointer-events: all;
    background: white;
    border: none;
    border-radius: 0px;

    /* &[data-isactive='true'] {
    background-color: lightblue;
    } */
`;

const ElementsToggle = styled(SideBarToggle)`
    border-radius: 5px 0 0 5px;
`;

interface ElementsMenuProps {
    activity: Activity;
}

export const ElementsMenu: FC<ElementsMenuProps> = track(({ activity }) => {
    const app = useApp();

    // For expanding and collapsing the sidebar
    const [isExpanded, setIsExpanded] = useState(true);
    const toggleDisplay = () => setIsExpanded(!isExpanded);
    const Arrow = isExpanded ? RightArrow : LeftArrow;

    return (
        <ElementsBarContainer className={isExpanded ? "" : "slide-right"}>
            <ElementsToggle onClick={toggleDisplay}>
                <Arrow />
            </ElementsToggle>
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
                            data-isactive={app.currentToolId === "draw"}
                            onClick={() => app.setSelectedTool("draw")}
                        >
                            ✏️ Draw
                        </Element>
                    </ElementsTool>
                </ElementsSection>

                <ElementsSection>
                    <typography.MediumText>Shapes</typography.MediumText>

                    <ElementsTool>
                        <Element
                            data-isactive={app.currentToolId === "draw"}
                            onClick={() => app.setSelectedTool("draw")}
                        >
                            ✏️ Draw
                        </Element>
                    </ElementsTool>
                </ElementsSection>

                <ElementsSection>
                    <typography.MediumText>Images</typography.MediumText>

                    <ElementsTool>
                        <Element
                            data-isactive={app.currentToolId === "note"}
                            onClick={() => app.setSelectedTool("note")}
                        >
                            Element
                        </Element>
                    </ElementsTool>
                </ElementsSection>
            </ElementsMenuContainer>
        </ElementsBarContainer>
    );
});
