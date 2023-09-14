import { Rect } from "react-konva";
import color from "../styles/color";
import Konva from "konva";

export const SelectionRect: React.FC<{
    selectionRectRef: React.RefObject<Konva.Rect>;
    x: number;
    y: number;
    width: number;
    height: number;
}> = ({ selectionRectRef, x, y, width, height }) => {
    return (
        <Rect
            ref={selectionRectRef}
            x={x}
            y={y}
            width={width}
            height={height}
            fill={color.lightBlue}
            stroke={color.blue}
            strokeWidth={2}
            opacity={0.25}
        />
    );
};
