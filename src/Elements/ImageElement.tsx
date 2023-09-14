import { Fragment, useEffect, useRef } from "react";
import Konva from "konva";
import { Image, Transformer } from "react-konva";
import { ImageProp } from "../utils/interfaces";

interface ImageElementProp {
    image: ImageProp;
    isSelected: boolean;
    onSelect: any;
    onChange: any;
    perfectDrawEnabled?: boolean;
    draggable: boolean;
    handleDragStart: (e: Konva.KonvaEventObject<DragEvent>) => void;
    handleDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
}

const ImageElement = ({
    image,
    isSelected,
    onSelect,
    onChange,
    perfectDrawEnabled,
    draggable,
    handleDragStart,
    handleDragEnd,
}: ImageElementProp) => {
    // const [dragSelected, setDragSelected] = useState(false);
    const imageRef = useRef<Konva.Image | null>(null);
    const transformerRef = useRef<Konva.Transformer | null>(null);

    useEffect(() => {
        if (isSelected /* || dragSelected */) {
            // we need to attach transformer manually
            // TODO: make a transformer state for removing transformer nodes while exporting
            if (transformerRef.current !== null && imageRef.current !== null) {
                const transformer = transformerRef.current;
                transformer.nodes([imageRef.current]);
                transformer.getLayer()?.batchDraw();
            }
        }
    }, [isSelected]);

    return (
        <Fragment>
            <Image
                {...image}
                onClick={onSelect}
                ref={imageRef}
                perfectDrawEnabled={perfectDrawEnabled}
                draggable={draggable}
                onDragStart={(e) => {
                    // setDragSelected(true);
                    handleDragStart(e);
                }}
                onDragEnd={(e) => {
                    // setDragSelected(false);
                    handleDragEnd(e);
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
            {isSelected /* || dragSelected */ && (
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
