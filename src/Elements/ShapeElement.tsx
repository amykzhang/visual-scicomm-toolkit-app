import { useRef } from "react";
import Konva from "konva";
import { Rect, Circle, RegularPolygon } from "react-konva";
import { ShapeProp } from "../utils/interfaces";

interface ShapeElementProp {
    shape: ShapeProp;
    draggable: boolean;
    // handleDragStart: () => void;
    handleChange: (id: string, attributes: any) => void;
}

const ShapeElement = ({ shape, draggable, handleChange }: ShapeElementProp) => {
    const shapeRef = useRef<Konva.Rect | Konva.Circle | Konva.RegularPolygon>(null);

    const Shape =
        shape.shape === "rectangle" ? Rect : shape.shape === "circle" ? Circle : RegularPolygon;

    return (
        <Shape
            {...shape}
            ref={shapeRef as any}
            draggable={draggable}
            radius={shape.width / 2} // For Circle
            sides={3} // For Triangle
            strokeScaleEnabled={false}
            onDragEnd={(e) =>
                handleChange(shape.id, {
                    x: e.target.x(),
                    y: e.target.y(),
                })
            }
            onTransformEnd={(e) => {
                if (shapeRef.current !== null) {
                    const node = shapeRef.current;
                    handleChange(shape.id, {
                        x: node.x(),
                        y: node.y(),
                        width: node.width(),
                        height: node.height(),
                        scaleX: node.scaleX(),
                        scaleY: node.scaleY(),
                        rotation: node.rotation(),
                    });
                }
            }}
        />
    );
};

export default ShapeElement;
