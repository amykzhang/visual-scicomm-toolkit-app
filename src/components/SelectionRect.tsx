import { Rect } from "react-konva";
import color from "../styles/color";

export const SelectionRect: React.FC<{
    x: number;
    y: number;
    width: number;
    height: number;
}> = ({ x, y, width, height }) => {
    return (
        <Rect
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
