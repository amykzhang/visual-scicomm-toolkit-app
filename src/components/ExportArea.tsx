import { Rect } from "react-konva";

export const ExportArea: React.FC<{ width: number; height: number }> = ({
    width,
    height,
}) => {
    return (
        <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            id={"export-area"}
            draggable={false}
            fill={"transparent"}
            stroke={"#D6D6D6"}
            strokeWidth={2}
        ></Rect>
    );
};
