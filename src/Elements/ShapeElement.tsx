import { Fragment, useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Rect, Circle, RegularPolygon, Transformer } from "react-konva";
import { ShapeProp } from "../utils/interfaces";

interface ShapeElementProp {
    shape: ShapeProp;
    draggable: boolean;
    transformFlag: boolean;
    setTransformFlag: React.Dispatch<React.SetStateAction<boolean>>;
    handleChange: (attributes: any) => void;
    handleSelect: () => void;
    handleDragStart: (e: Konva.KonvaEventObject<DragEvent>) => void;
    handleDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
    selectionRef: React.MutableRefObject<string[]>;
    updateResetGroup: () => void;
}

const ShapeElement = ({
    shape,
    draggable,
    transformFlag,
    setTransformFlag,
    handleChange,
    handleSelect,
    handleDragStart,
    handleDragEnd,
    selectionRef,
    updateResetGroup,
}: ShapeElementProp) => {
    const isSelected = selectionRef.current.includes(shape.id);
    // When the element is dragged selected but not selected yet (to show transformer when dragging and globalflag is disabled)
    const [dragSelected, setDragSelected] = useState(false);

    // If transformFlag is disabled from App, no transformer will be shown unless the specific element is drag selected
    // Otherwise, show if it is selected or drag selected
    const showTransform = (transformFlag || dragSelected) && (isSelected || dragSelected);

    const shapeRef = useRef<Konva.Rect | Konva.Circle | Konva.RegularPolygon | null>(null);
    const transformerRef = useRef<Konva.Transformer | null>(null);

    // Assign Konva Shape based on shape type
    const konvaShapeMap: Record<string, typeof Rect | typeof Circle | typeof RegularPolygon> = {
        rectangle: Rect,
        circle: Circle,
        triangle: RegularPolygon,
    };

    const Shape = konvaShapeMap[shape.shape];

    useEffect(() => {
        // Show transformer when the shape is selected or dragged
        if (showTransform) {
            // we need to attach transformer manually
            if (transformerRef.current !== null && shapeRef.current !== null) {
                const transformer = transformerRef.current;
                transformer.nodes([shapeRef.current]);
                transformer.getLayer()?.batchDraw();
            }
        }
    }, [showTransform]);

    return (
        <Fragment>
            <Shape
                {...shape}
                strokeScaleEnabled={false}
                radius={shape.width / 2} // For Circle
                sides={3} // For Triangle
                ref={shapeRef as any}
                draggable={draggable}
                onClick={handleSelect}
                onMouseDown={() => {
                    updateResetGroup();
                }}
                onDragStart={(e) => {
                    setDragSelected(true);
                    setTransformFlag(false);
                    handleDragStart(e);
                }}
                onDragEnd={(e) => {
                    handleDragEnd(e);
                    selectionRef.current = [shape.id];
                    setTransformFlag(true);
                    setDragSelected(false);
                }}
                onTransformEnd={() => {
                    // transformer is changing scale of the node
                    // and NOT its width or height
                    // but in the store we have only width and height
                    // to match the data better we will reset scale on transform end
                    if (shapeRef.current !== null) {
                        const node = shapeRef.current;
                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();
                        const rotation = node.rotation();

                        handleChange({
                            x: node.x(),
                            y: node.y(),
                            // set minimal value
                            width: Math.max(5, node.width()),
                            height: Math.max(5, node.height()),
                            scaleX: scaleX,
                            scaleY: scaleY,
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

export default ShapeElement;
