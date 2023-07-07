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
import { ReactComponent as Doodle } from "../assets/doodle.svg";
import { ImageTool } from "./ImageTool";

interface IImageSubsection {
    icons: string[];
    srcs: string[];
}

const ElementsBarContainer = styled(SideBar)`
    right: 0;
`;

const ElementsMenuContainer = styled(SideBarContent)`
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 11px;
    flex-direction: column;

    border-radius: 0px 0px 0px 5px;
`;

const ElementsRow = styled.div`
    pointer-events: all;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 3px;
    flex-direction: row;
    width: 100%;
`;

const ElementTool = styled.div`
    pointer-events: all;
    background: white;
    border: none;
    border-radius: 0px;

    &:hover {
        background-color: #d7e9ff;
    }

    &[data-isactive="true"] {
        background-color: #d7e9ff;
    }
`;

const ElementsToggle = styled(SideBarToggle)`
    border-radius: 5px 0 0 5px;
`;

const ImageSubheadingText = styled(typography.BoldSmallText)`
    color: #606060;
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
    const sections = activity.elements.images.sections;

    const ImageSection = () => {
        return (
            <>
                {sections.map((section) => (
                    <>
                        <ImageSubheadingText>
                            {section.subheading}
                        </ImageSubheadingText>
                        <ImageSubsection {...section} />
                    </>
                ))}
            </>
        );
    };

    const ImageSubsection: FC<IImageSubsection> = ({ icons, srcs }) => {
        return (
            <ElementsRow>
                {srcs.map((src, i) => (
                    <ImageTool src={src} name={icons[i]} />
                ))}
            </ElementsRow>
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
                <typography.BoldMediumText>Text</typography.BoldMediumText>
                <TextTool />
                <typography.BoldMediumText>Lines</typography.BoldMediumText>
                <ElementTool
                    data-isactive={app.currentToolId === "draw"}
                    onClick={() => app.setSelectedTool("draw")}
                >
                    <Doodle />
                </ElementTool>
                <typography.BoldMediumText>Shapes</typography.BoldMediumText>
                todo
                <typography.BoldMediumText>Images</typography.BoldMediumText>
                <ImageSection />
            </ElementsMenuContainer>
        </ElementsBarContainer>
    );
});
