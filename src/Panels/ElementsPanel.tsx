import { FC } from "react";
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

const ElementsMenuHeader = styled(SideBarHeader)`
`;

const ElementsToggle = styled(SideBarToggle)`
    margin: 6px;
`;

const ElementsRow = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 12px 3px;
    width: 288px;
`;

const ImageSubheadingText = styled(typography.BoldSmallText)`
    color: ${color.black};
`;

interface ElementsMenuProps {
    activity: Activity;
    images: ImageProp[];
    setImages: React.Dispatch<React.SetStateAction<ImageProp[]>>;
    stageRef: React.MutableRefObject<Konva.Stage | null>;
    isOpen: boolean;
    handleToggle: () => void;
}

export const ElementsPanel: FC<ElementsMenuProps> = ({
    activity,
    images,
    setImages,
    stageRef,
    isOpen,
    handleToggle,
}) => {
    // For expanding and collapsing the sidebar
    const Arrow = isOpen ? RightArrow : LeftArrow;

    const elements = activity.elements;
    const image_sections = activity.elements.images.sections;
    const shapes = activity.elements.shapes;
    const lines = activity.elements.lines;

    const TextSection = () => {
        return (
            <>
                <ImageSubheadingText>
                    {elements.text.heading}
                </ImageSubheadingText>
                <ElementsRow>
                    <TextTool />
                </ElementsRow>
            </>
        );
    };

    const DrawSection = () => {
        const { heading, contents } = elements.draw;
        return (
            <>
                <ImageSubheadingText>{heading}</ImageSubheadingText>
                <ElementsRow>
                    {contents.map((item, i) => {
                        if (
                            item.type === "tool" &&
                            item.tool === "freehand-draw"
                        ) {
                            return <Doodle key={i} />;
                        } else return <></>;
                    })}
                </ElementsRow>
            </>
        );
    };

    const LinesSection = () => {
        const { srcs, icons, sizes } = lines;
        return (
            <>
                <ImageSubheadingText>{lines.heading}</ImageSubheadingText>
                <ElementsRow>
                    {srcs.map((src, i) => {
                        return (
                            <ImageTool
                                key={i}
                                src={src}
                                name={icons[i]}
                                dimensions={sizes[i]}
                                images={images}
                                setImages={setImages}
                                stageRef={stageRef}
                            />
                        );
                    })}
                </ElementsRow>
            </>
        );
    };

    const ShapeSection = () => {
        const { heading, srcs, icons, sizes } = shapes;
        return (
            <>
                <ImageSubheadingText>{heading}</ImageSubheadingText>
                <ElementsRow>
                    {srcs.map((src, i) => (
                        <ImageTool
                            key={i}
                            src={src}
                            name={icons[i]}
                            dimensions={sizes[i]}
                            images={images}
                            setImages={setImages}
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
                        <ImageSubheadingText>
                            {section.subheading}
                        </ImageSubheadingText>

                        <ElementsRow>
                            {section.srcs.map((src, j) => (
                                <ImageTool
                                    key={j}
                                    src={src}
                                    dimensions={section.sizes[j]}
                                    name={section.icons[j]}
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
        <ElementsPanelContainer className={isOpen ? "" : "slide-right"}>
            <SideBarHeader>
                <ElementsToggle onClick={handleToggle}>
                    <Arrow />
                </ElementsToggle>
                <PenAndRuler />
                <typography.LargeText>Elements</typography.LargeText>
            </SideBarHeader>
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
