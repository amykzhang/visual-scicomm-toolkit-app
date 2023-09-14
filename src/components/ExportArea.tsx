import { Rect } from "react-konva";
import color from "../styles/color";
import Konva from "konva";

export const ExportArea: React.FC<{
    exportAreaRef: React.RefObject<Konva.Rect>;
    width: number;
    height: number;
    onClick: (e: Konva.KonvaEventObject<MouseEvent>) => void;
}> = ({ exportAreaRef, width, height, onClick }) => {
    return (
        <Rect
            ref={exportAreaRef}
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
