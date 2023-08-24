import React, { Fragment } from "react";
import Konva from "konva";
import { Stage, Layer, Image, Transformer } from "react-konva";
import { ImageProp } from "../utils/interfaces";
import { handleDragEnd, handleDragStart } from "../functions";

interface ImageElementProps {
    imageProps: ImageProp;
    isSelected: boolean;
    toggleSelect: any;
    onChange: any;
    images: ImageProp[];
    setImages: React.Dispatch<React.SetStateAction<ImageProp[]>>;
    draggable: boolean;
}

const ImageElement = ({
    imageProps,
    isSelected,
    toggleSelect,
    onChange,
    images,
    setImages,
    draggable,
}: ImageElementProps) => {
    const imageRef = React.useRef<Konva.Image | null>(null);
    const trRef = React.useRef<Konva.Transformer | null>(null);

    React.useEffect(() => {
        if (isSelected) {
            // we need to attach transformer manually
            if (trRef.current !== null && imageRef.current !== null) {
                trRef.current.nodes([imageRef.current]);
                trRef.current.getLayer()?.batchDraw();
            }
        }
    }, [isSelected]);

    return (
        <Fragment>
            <Image
                {...imageProps}
                onClick={toggleSelect}
                onTap={toggleSelect}
                ref={imageRef}
                draggable={draggable}
                onDragStart={handleDragStart(images, setImages)}
                onDragEnd={handleDragEnd(images, setImages)}
                onTransformEnd={(e) => {
                    // transformer is changing scale of the node
                    // and NOT its width or height
                    // but in the store we have only width and height
                    // to match the data better we will reset scale on transform end
                    if (imageRef.current !== null) {
                        const node = imageRef.current;
                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();

                        // we will reset it back
                        node.scaleX(1);
                        node.scaleY(1);
                        onChange({
                            ...imageProps,
                            x: node.x(),
                            y: node.y(),
                            // set minimal value
                            width: Math.max(5, node.width() * scaleX),
                            height: Math.max(node.height() * scaleY),
                        });
                    }
                }}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
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
