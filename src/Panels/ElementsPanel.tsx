import { FC, useState } from "react";
import Konva from "konva";
import { ImageProp } from "../utils/interfaces";
import { Activity } from "../activity/activity";
import { ReactComponent as LeftArrow } from "../assets/arrowhead-left.svg";
import { ReactComponent as RightArrow } from "../assets/arrowhead-right.svg";
import { ReactComponent as PenAndRuler } from "../assets/penandruler.svg";
import { ReactComponent as Doodle } from "../assets/doodle.svg";
import { ImageTool } from "../components/ImageTool";
import { TextTool } from "../components/TextTool";
import typography from "../styles/typography";
import {
    SideBar,
    SideBarContent,
    SideBarHeader,
    SideBarToggle,
} from "../styles/containers";
import styled from "styled-components";

const ElementsPanelContainer = styled(SideBar)`
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
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 3px;
    width: 288px;
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
    images: ImageProp[];
    setImages: React.Dispatch<React.SetStateAction<ImageProp[]>>;
    stageRef: React.MutableRefObject<Konva.Stage | null>;
}

export const ElementsPanel: FC<ElementsMenuProps> = ({
    activity,
    images,
    setImages,
    stageRef,
}) => {
    // For expanding and collapsing the sidebar
    const [isExpanded, setIsExpanded] = useState(true);
    const toggleDisplay = () => setIsExpanded(!isExpanded);
    const Arrow = isExpanded ? RightArrow : LeftArrow;

    const elements = activity.elements;
    const sections = activity.elements.images.sections;

    const ImageSection = () => {
        return (
            <>
                {sections.map((section, i) => (
                    <div key={i}>
                        <ImageSubheadingText>
                            {section.subheading}
                        </ImageSubheadingText>

                        <ElementsRow>
                            {section.srcs.map((src, j) => (
                                <ImageTool
                                    key={j}
                                    src={src}
                                    name={section.icons[i]}
                                    images={images}
                                    setImages={setImages}
                                    stageRef={stageRef}
                                />
                            ))}
                        </ElementsRow>
                    </div>
                ))}
            </>
        );
    };

    return (
        <ElementsPanelContainer className={isExpanded ? "" : "slide-right"}>
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
                // data-isactive={app.currentToolId === "draw"}
                // onClick={() => app.setSelectedTool("draw")}
                >
                    <Doodle />
                </ElementTool>
                <typography.BoldMediumText>Shapes</typography.BoldMediumText>
                todo
                <typography.BoldMediumText>Images</typography.BoldMediumText>
                <ImageSection />
            </ElementsMenuContainer>
        </ElementsPanelContainer>
    );
};
