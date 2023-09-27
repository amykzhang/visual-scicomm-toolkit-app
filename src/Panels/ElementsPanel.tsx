import { FC } from "react";
import Konva from "konva";
import { ElementProp } from "../utils/interfaces";
import { Activity } from "../activity/activity";
import { ReactComponent as LeftArrow } from "../assets/arrowhead-left.svg";
import { ReactComponent as RightArrow } from "../assets/arrowhead-right.svg";
import { ReactComponent as PenAndRuler } from "../assets/penandruler.svg";
import { ReactComponent as Doodle } from "../assets/doodle.svg";
import { ImageTool } from "../components/ImageTool";
import { TextTool } from "../components/TextTool";
import { RectangleTool } from "../components/RectangleTool";
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
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 12px 3px;
    padding: 4px 4px;
    border-radius: 5px;
    background: ${color.lighterBlue};
`;

const ImageSubheadingText = styled(typography.BoldSmallText)`
    color: ${color.black};
`;

interface ElementsMenuProps {
    activity: Activity;
    elements: ElementProp[];
    setElements: React.Dispatch<React.SetStateAction<ElementProp[]>>;
    stageRef: React.MutableRefObject<Konva.Stage | null>;
    isOpen: boolean;
    handleToggle: () => void;
}

export const ElementsPanel: FC<ElementsMenuProps> = ({
    activity,
    elements,
    setElements,
    stageRef,
    isOpen,
    handleToggle,
}) => {
    // For expanding and collapsing the sidebar
    const Arrow = isOpen ? RightArrow : LeftArrow;

    const image_sections = activity.elements.images.sections;
    const activity_shapes = activity.elements.shapes;
    const activity_lines = activity.elements.lines;

    const TextSection = () => {
        return (
            <>
                <ImageSubheadingText>{activity.elements.text.heading}</ImageSubheadingText>
                <ElementsRow>
                    <TextTool />
                </ElementsRow>
            </>
        );
    };

    const DrawSection = () => {
        const { heading, contents } = activity.elements.draw;
        return (
            <>
                <ImageSubheadingText>{heading}</ImageSubheadingText>
                <ElementsRow>
                    {contents.map((item, i) => {
                        if (item.type === "tool" && item.tool === "freehand-draw") {
                            return <Doodle key={i} />;
                        } else return <></>;
                    })}
                </ElementsRow>
            </>
        );
    };

    const LinesSection = () => {
        const { srcs, icons, sizes } = activity_lines;
        return (
            <>
                <ImageSubheadingText>{activity_lines.heading}</ImageSubheadingText>
                <ElementsRow>
                    {srcs.map((src, i) => {
                        return (
                            <ImageTool
                                key={i}
                                src={src}
                                name={icons[i]}
                                dimensions={sizes[i]}
                                elements={elements}
                                setElements={setElements}
                                stageRef={stageRef}
                            />
                        );
                    })}
                </ElementsRow>
            </>
        );
    };

    const ShapeSection = () => {
        const { heading, srcs } = activity_shapes;
        return (
            <>
                <ImageSubheadingText>{heading}</ImageSubheadingText>
                <ElementsRow>
                    {srcs.map((src, i) => (
                        <RectangleTool
                            key={i}
                            src={src}
                            elements={elements}
                            setElements={setElements}
                            stageRef={stageRef}
                        />
                    ))}
                </ElementsRow>
            </>
        );
    };

    const ImageSection = () => {
        return (
            <>
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
            </>
        );
    };

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
