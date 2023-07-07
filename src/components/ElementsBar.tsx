import { FC, useState } from "react";
import { useApp } from "@tldraw/tldraw";
import "@tldraw/tldraw/editor.css";
import { track } from "signia-react";
import { TextTool } from "./TextTool";
import typography from "../styles/typography";
import styled from "styled-components";
import { Activity } from "../activity/activity";
import {
    SideBar,
    SideBarContent,
    SideBarHeader,
    SideBarToggle,
} from "../styles/containers";
import { ReactComponent as LeftArrow } from "../assets/arrowhead-left.svg";
import { ReactComponent as RightArrow } from "../assets/arrowhead-right.svg";
import { ReactComponent as PenAndRuler } from "../assets/penandruler.svg";

interface IImageSubsection {
    icons: string[];
    src: string[];
}

const ElementsBarContainer = styled(SideBar)`
    right: 0;
`;

const ElementsMenuContainer = styled(SideBarContent)`
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
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

export const ElementsBar: FC<ElementsMenuProps> = track(({ activity }) => {
    const app = useApp();

    // For expanding and collapsing the sidebar
    const [isExpanded, setIsExpanded] = useState(true);
    const toggleDisplay = () => setIsExpanded(!isExpanded);
    const Arrow = isExpanded ? RightArrow : LeftArrow;

    const elements = activity.elements;
    const images = activity.elements.images;
    const sections = activity.elements.images.sections;

    const ImageSection = () => {
        return (
            <>
                {sections.map((section) => (
                    <>
                        <typography.MediumText>
                            {section.subheading}
                        </typography.MediumText>
                        <ImageSubsection {...section} />
                    </>
                ))}
            </>
        );
    };

    const ImageSubsection: FC<IImageSubsection> = ({ icons, src }) => {
        return (
            <>
                {icons.map((icon, i) => (
                    <>
                        <typography.SmallText>{icon}</typography.SmallText>
                        {/* <ImageTool {...src} /> */}
                    </>
                ))}
            </>
        );
    };

    return (
        <ElementsBarContainer className={isExpanded ? "" : "slide-right"}>
            <ElementsToggle onClick={toggleDisplay}>
                <Arrow />
            </ElementsToggle>
            <ElementsMenuContainer>
                <SideBarHeader>
                    <PenAndRuler />
                    <typography.LargeText>Elements</typography.LargeText>
                </SideBarHeader>

                <ElementsSection>
                    <typography.BoldMediumText>Text</typography.BoldMediumText>

                    <ElementsTool>
                        <TextTool />
                    </ElementsTool>
                </ElementsSection>

                <ElementsSection>
                    <typography.BoldMediumText>Lines</typography.BoldMediumText>

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
                    <typography.BoldMediumText>
                        Shapes
                    </typography.BoldMediumText>

                    <ElementsTool>
                        <Element
                            data-isactive={app.currentToolId === "draw"}
                            onClick={() => app.setSelectedTool("draw")}
                        >
                            ✏️ Draw
                        </Element>
                    </ElementsTool>
                </ElementsSection>

                <typography.BoldMediumText>Images</typography.BoldMediumText>
                <ElementsSection>
                    <ImageSection />
                </ElementsSection>
            </ElementsMenuContainer>
        </ElementsBarContainer>
    );
});
