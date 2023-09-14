import { Rect } from "react-konva";
import color from "../styles/color";

export const ExportArea: React.FC<{
    width: number;
    height: number;
    onClick: () => void;
}> = ({ width, height, onClick }) => {
    return (
        <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            id={"export-area"}
            draggable={false}
            fill={color.white}
            stroke={color.darkGrey}
            strokeWidth={2}
            onClick={onClick}
        />
    );
};
