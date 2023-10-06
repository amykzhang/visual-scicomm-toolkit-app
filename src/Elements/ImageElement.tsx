import { Fragment, useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Image, Transformer } from "react-konva";
import { ImageProp } from "../utils/interfaces";

interface ImageElementProp {
    image: ImageProp;
    draggable: boolean;
    transformFlag: boolean;
    setTransformFlag: React.Dispatch<React.SetStateAction<boolean>>;
    handleChange: (attributes: any) => void;
    handleSelect: () => void;
    handleDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
    selectionRef: React.MutableRefObject<string[]>;
}

const ImageElement = ({
    image,
    draggable,
    transformFlag,
    setTransformFlag,
    handleChange,
    handleSelect,
    handleDragEnd,
    selectionRef,
}: ImageElementProp) => {
    const isSelected = selectionRef.current.includes(image.id);
    // When the element is dragged selected but not selected yet (to show transformer when dragging and globalflag is disabled)
    const [dragSelected, setDragSelected] = useState(false);

    // If transformFlag is disabled from App, no transformer will be shown unless the specific element is drag selected
    // Otherwise, show if it is selected or drag selected
    const showTransform = (transformFlag || dragSelected) && (isSelected || dragSelected);

    const imageRef = useRef<Konva.Image | null>(null);
    const transformerRef = useRef<Konva.Transformer | null>(null);

    const imageElement = new window.Image();
    imageElement.width = image.width;
    imageElement.height = image.height;
    imageElement.src = image.src;

    useEffect(() => {
        // Show transformer when the image is selected or dragged
        if (showTransform) {
            // we need to attach transformer manually
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
                image={imageElement}
                ref={imageRef}
                draggable={draggable}
                onClick={handleSelect}
                onDragStart={(e) => {
                    setDragSelected(true);
                    setTransformFlag(false);
                }}
                onDragEnd={(e) => {
                    handleDragEnd(e);
                    selectionRef.current = [image.id];
                    setTransformFlag(true);
                    setDragSelected(false);
                }}
                onTransformEnd={() => {
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

                        handleChange({
                            x: node.x(),
                            y: node.y(),
                            // set minimal value
                            width: Math.max(5, node.width() * scaleX),
                            height: Math.max(5, node.height() * scaleY),
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

export default ImageElement;
