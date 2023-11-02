import { useRef } from "react";
import Konva from "konva";
import { Image } from "react-konva";
import { ImageProp } from "../utils/interfaces";

interface ImageElementProp {
    image: ImageProp;
    draggable: boolean;
    handleChange: (id: string, attributes: any) => void;
}

const ImageElement = ({ image, draggable, handleChange }: ImageElementProp) => {
    const imageRef = useRef<Konva.Image>(null);

    const imageElement = new window.Image(image.width, image.height);
    imageElement.src = image.src;

    return (
        <Image
            {...image}
            image={imageElement}
            ref={imageRef}
            draggable={draggable}
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
                        width: node.width() * node.scaleX(),
                        height: node.height() * node.scaleY(),
                        scaleX: 1,
                        scaleY: 1,
                        rotation: node.rotation(),
                    });
                    node.scaleX(1);
                    node.scaleY(1);
                }
            }}
        />
    );
};

export default ImageElement;
