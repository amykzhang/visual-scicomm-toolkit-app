import { FC } from "react";
import Konva from "konva";
import { ElementProp } from "../utils/interfaces";
import { Activity } from "../activity/activity";
import { ReactComponent as LeftArrow } from "../assets/arrowhead-left.svg";
import { ReactComponent as RightArrow } from "../assets/arrowhead-right.svg";
import { ReactComponent as PenAndRuler } from "../assets/penandruler.svg";
import { ImageTool } from "../components/ImageTool";
import { TextTool } from "../components/TextTool";
import { ShapeTool } from "../components/ShapeTool";
import typography from "../styles/typography";
import {
    SideBar,
    SideBarBackground,
    SideBarContent,
    SideBarHeader,
    SideBarToggle,
} from "../styles/containers";
import styled from "styled-components";
import color from "../styles/color";
import { APP_VIEW } from "../utils/enums";
import { DrawTool } from "../components/DrawTool";

const ElementsPanelContainer = styled(SideBar)`
    right: 0;
`;

const ElementsMenuContainer = styled(SideBarContent)`
    position: fixed;
    top: 80px;
    right: 0;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;

    gap: 11px;
    border-radius: 0px 0px 0px 5px;
`;

const ElementsMenuBackground = styled(SideBarBackground)`
    position: fixed;
    right: 0;
    border-radius: 0px 5px 0px 0px;
`;

const ElementsToggle = styled(SideBarToggle)`
    margin: 6px;
`;

const ElementsRow = styled.div`
    width: 290px;
    min-height: 47px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
    gap: 12px 3px;
    padding: 4px 4px;
    border-radius: 5px;
    background: ${color.lighterBlue};
`;

const ImageSubheadingText = styled(typography.BoldSmallText)`
    color: ${color.black};
`;

interface ElementsMenuProps {
    view: APP_VIEW;
    activity: Activity;
    elements: ElementProp[];
    setElements: React.Dispatch<React.SetStateAction<ElementProp[]>>;
    stageRef: React.MutableRefObject<Konva.Stage | null>;
    isOpen: boolean;
    handleToggle: () => void;
    toggleTextMode: () => void;
    toggleDrawMode: () => void;
}

export const ElementsPanel: FC<ElementsMenuProps> = ({
    activity,
    elements,
    setElements,
    stageRef,
    isOpen,
    handleToggle,
    toggleTextMode,
    toggleDrawMode,
    view,
}) => {
    // For expanding and collapsing the sidebar
    const Arrow = isOpen ? RightArrow : LeftArrow;

    const image_sections = activity.elements.images.sections;
    const activity_shapes = activity.elements.shapes;
    const activity_lines = activity.elements.lines;

    const TextSection = () => (
        <div>
            <ImageSubheadingText>{activity.elements.text.heading}</ImageSubheadingText>
            <ElementsRow>
                <TextTool isTextMode={view === APP_VIEW.text} toggleTextMode={toggleTextMode} />
            </ElementsRow>
        </div>
    );
    const DrawSection = () => (
        <div>
            <ImageSubheadingText>{activity.elements.draw.heading}</ImageSubheadingText>
            <ElementsRow>
                <DrawTool isDrawMode={view === APP_VIEW.draw} toggleDrawMode={toggleDrawMode} />
            </ElementsRow>
        </div>
    );

    const LinesSection = () => (
        <div>
            <ImageSubheadingText>{activity_lines.heading}</ImageSubheadingText>
            <ElementsRow>
                {activity_lines.srcs.map((src, i) => (
                    <ImageTool
                        key={i}
                        src={src}
                        dimensions={activity_lines.sizes[i]}
                        name={activity_lines.icons[i]}
                        elements={elements}
                        setElements={setElements}
                        stageRef={stageRef}
                    />
                ))}
            </ElementsRow>
        </div>
    );

    const ShapeSection = () => (
        <div>
            <ImageSubheadingText>{activity_shapes.heading}</ImageSubheadingText>
            <ElementsRow>
                {activity_shapes.shapes.map((shape_icon, i) => (
                    <ShapeTool
                        key={i}
                        shape={shape_icon}
                        fill={activity_shapes.fill[i]}
                        elements={elements}
                        setElements={setElements}
                        stageRef={stageRef}
                    />
                ))}
            </ElementsRow>
        </div>
    );

    const ImageSection = () => (
        <div>
            {image_sections.map((section, i) => (
                <div key={i}>
                    <ImageSubheadingText>{section.subheading}</ImageSubheadingText>
                    <ElementsRow>
                        {section.srcs.map((src, j) => (
                            <ImageTool
                                key={j}
                                src={src}
                                dimensions={section.sizes[j]}
                                name={section.icons[j]}
                                elements={elements}
                                setElements={setElements}
                                stageRef={stageRef}
                            />
                        ))}
                    </ElementsRow>
                </div>
            ))}
        </div>
    );

    return (
        <ElementsPanelContainer className={isOpen ? "" : "slide-right"}>
            <SideBarHeader>
                <ElementsToggle onClick={handleToggle}>
                    <Arrow />
                </ElementsToggle>
                <PenAndRuler />
                <typography.LargeText>Elements</typography.LargeText>
            </SideBarHeader>
            <ElementsMenuBackground />
            <ElementsMenuContainer>
                <TextSection />
                <DrawSection />
                <LinesSection />
                <ShapeSection />
                <ImageSection />
            </ElementsMenuContainer>
        </ElementsPanelContainer>
    );
};
