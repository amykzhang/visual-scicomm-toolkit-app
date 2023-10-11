import { Line, Transformer } from "react-konva";
import { LineProp } from "../utils/interfaces";
import Konva from "konva";
import { Fragment, useEffect, useRef, useState } from "react";

interface LineElementProp {
    line: LineProp;
    draggable: boolean;
    transformFlag: boolean;
    setTransformFlag: React.Dispatch<React.SetStateAction<boolean>>;
    handleChange: (attributes: any) => void;
    handleSelect: () => void;
    handleDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
    groupSelection: string[];
    setGroupSelection: React.Dispatch<React.SetStateAction<string[]>>;
}

const LineElement = ({
    line,
    draggable,
    transformFlag,
    setTransformFlag,
    handleChange,
    handleSelect,
    handleDragEnd,
    groupSelection,
    setGroupSelection,
}: LineElementProp) => {
    const isSelected = groupSelection.includes(line.id);
    // When the element is dragged selected but not selected yet (to show transformer when dragging and globalflag is disabled)
    const [dragSelected, setDragSelected] = useState(false);

    // If transformFlag is disabled from App, no transformer will be shown unless the specific element is drag selected
    // Otherwise, show if it is selected or drag selected
    const showTransform = (transformFlag || dragSelected) && (isSelected || dragSelected);

    const lineRef = useRef<Konva.Line | null>(null);
    const transformerRef = useRef<Konva.Transformer | null>(null);

    useEffect(() => {
        // Show transformer when the shape is selected or dragged
        if (showTransform) {
            // we need to attach transformer manually
            if (transformerRef.current !== null && lineRef.current !== null) {
                const transformer = transformerRef.current;
                transformer.nodes([lineRef.current]);
                transformer.getLayer()?.batchDraw();
            }
        }
    }, [showTransform]);

    return (
        <Fragment>
            <Line
                {...line}
                ref={lineRef}
                draggable={draggable}
                onClick={handleSelect}
                onDragStart={(e) => {
                    setDragSelected(true);
                    setTransformFlag(false);
                }}
                onDragEnd={(e) => {
                    handleDragEnd(e);
                    setGroupSelection([line.id]);
                    setTransformFlag(true);
                    setDragSelected(false);
                }}
                onTransform={(e) => {
                    if (lineRef.current !== null) {
                        const node = lineRef.current;
                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();
                        const scaledPoints = node.points().map((point, i) => {
                            if (i % 2 === 0) return point * scaleX;
                            else return point * scaleY;
                        });

                        node.scaleX(1);
                        node.scaleY(1);
                        node.points(scaledPoints);
                    }
                }}
                onTransformEnd={() => {
                    // transformer is changing scale of the node
                    // and NOT its width or height
                    // but in the store we have only width and height
                    // to match the data better we will reset scale on transform end
                    if (lineRef.current !== null) {
                        const node = lineRef.current;
                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();
                        const rotation = node.rotation();
                        const scaledPoints = node.points().map((point, i) => {
                            if (i % 2 === 0) return point * scaleX;
                            else return point * scaleY;
                        });

                        node.scaleX(1);
                        node.scaleY(1);

                        handleChange({
                            x: node.x(),
                            y: node.y(),
                            width: node.width(),
                            height: node.height(),
                            points: scaledPoints,
                            rotation: rotation,
                        });
                    }
                }}
                onContextMenu={(e) => {
                    e.evt.preventDefault();
                }}
            />
            {showTransform && (
                <Transformer
                    ref={transformerRef}
                    keepRatio={false}
                    rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
                    boundBoxFunc={(oldBox, newBox) => {
                        // limit resize
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </Fragment>
    );
};

export default LineElement;
