import { useRef } from "react";
import Konva from "konva";
import { Image } from "react-konva";
import { ImageProp } from "../utils/interfaces";

interface ImageElementProp {
    image: ImageProp;
    draggable: boolean;
    handleSelect: () => void;
    handleDragStart: () => void;
    handleChange: (id: string, attributes: any) => void;
}

const ImageElement = ({
    image,
    draggable,
    handleSelect,
    handleDragStart,
    handleChange,
}: ImageElementProp) => {
    const imageRef = useRef<Konva.Image | null>(null);

    const imageElement = new window.Image(image.width, image.height);
    imageElement.src = image.src;

    return (
        <Image
            {...image}
            image={imageElement}
            ref={imageRef}
            onClick={handleSelect}
            draggable={draggable}
            onDragStart={handleDragStart}
            onDragEnd={(e) =>
                handleChange(image.id, {
                    x: e.target.x(),
                    y: e.target.y(),
                })
            }
            onTransformEnd={(e) => {
                if (imageRef.current !== null) {
                    const node = imageRef.current;
                    handleChange(image.id, {
                        x: node.x(),
                        y: node.y(),
                        width: node.width(),
                        height: node.height(),
                        scaleX: node.scaleX(),
                        scaleY: node.scaleY(),
                    });
                }
            }}
        />
    );
};

export default ImageElement;
