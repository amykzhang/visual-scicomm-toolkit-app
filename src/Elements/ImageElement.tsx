import { Fragment, useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Image, Transformer } from "react-konva";
import { ImageProp } from "../utils/interfaces";

interface ImageElementProp {
    image: ImageProp;
    isSelected: boolean;
    selectSelf: () => void;
    onChange: (attributes: any) => void;
    perfectDrawEnabled?: boolean;
    draggable: boolean;
    handleDragStart?: (e: Konva.KonvaEventObject<DragEvent>) => void;
    handleDragEnd?: (e: Konva.KonvaEventObject<DragEvent>) => void;
    transformFlag: boolean;
    setTransformFlag: React.Dispatch<React.SetStateAction<boolean>>;
    setGroupSelection: React.Dispatch<React.SetStateAction<string[]>>;
    updateResetGroup: () => void;
}

const ImageElement = ({
    image,
    isSelected,
    selectSelf,
    transformFlag,
    setTransformFlag,
    onChange,
    perfectDrawEnabled,
    draggable,
    handleDragStart,
    handleDragEnd,
    setGroupSelection,
    updateResetGroup,
}: ImageElementProp) => {
    // Controls to show transformer when the element is dragged selected but not selected yet
    const [dragSelected, setDragSelected] = useState(false);
    const showTransform = (transformFlag || dragSelected) && (isSelected || dragSelected);

    const imageRef = useRef<Konva.Image | null>(null);
    const transformerRef = useRef<Konva.Transformer | null>(null);

    useEffect(() => {
        // Show transformer when the image is selected or dragged
        if (showTransform) {
            // we need to attach transformer manually
            // TODO: make a transformer state for removing transformer nodes while exporting
            if (transformerRef.current !== null && imageRef.current !== null) {
                const transformer = transformerRef.current;
                transformer.nodes([imageRef.current]);
                transformer.getLayer()?.batchDraw();
            }
        }
    }, [showTransform]);

    return (
        <Fragment>
            <Image
                {...image}
                ref={imageRef}
                perfectDrawEnabled={perfectDrawEnabled}
                draggable={draggable}
                onClick={() => {
                    // console.log("onClick\n", image.id);
                    selectSelf();
                }}
                onMouseDown={() => {
                    // console.log("onMouseDown\n", image.id);
                    setDragSelected(true);
                    updateResetGroup();
                }}
                onMouseUp={() => {
                    // console.log("onMouseUp\n", image.id);
                    setDragSelected(false);
                }}
                onDragStart={(e) => {
                    // console.log("onDragStart\n", image.id);

                    setTransformFlag(false);
                    if (handleDragStart !== undefined) handleDragStart(e);
                }}
                onDragEnd={(e) => {
                    // console.log("onDragEnd\n", image.id);

                    if (handleDragEnd !== undefined) handleDragEnd(e);
                    setGroupSelection([image.id]);
                    setTransformFlag(true);
                }}
                onTransformStart={() => {
                    // console.log("onTransformStart\n", image.id);
                }}
                onTransformEnd={() => {
                    // console.log("onTransformEnd\n", image.id);
                    // transformer is changing scale of the node
                    // and NOT its width or height
                    // but in the store we have only width and height
                    // to match the data better we will reset scale on transform end
                    if (imageRef.current !== null) {
                        const node = imageRef.current;
                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();
                        const rotation = node.rotation();

                        // we will reset it back
                        node.scaleX(1);
                        node.scaleY(1);

                        onChange({
                            ...image,
                            x: node.x(),
                            y: node.y(),
                            // set minimal value
                            width: Math.max(5, node.width() * scaleX),
                            height: Math.max(5, node.height() * scaleY),
                            rotation: rotation,
                        });
                    }
                }}
            />
            {showTransform && (
                <Transformer
                    ref={transformerRef}
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

export default ImageElement;
