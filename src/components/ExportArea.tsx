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
            stroke={"#c1c1c1"}
            strokeWidth={2}
        ></Rect>
    );
};
