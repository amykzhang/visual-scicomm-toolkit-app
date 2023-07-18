import { Rect } from "react-konva";

export const ExportArea: React.FC<{ width: number; height: number }> = ({
    width,
    height,
}) => {
    const x = window.innerWidth / 2 - width / 2;
    const y = window.innerHeight / 2 - height / 2;

    return (
        <Rect
            x={x}
            y={y}
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
