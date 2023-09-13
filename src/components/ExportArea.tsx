import { Rect } from "react-konva";

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
            fill={"white"}
            stroke={"#c1c1c1"}
            strokeWidth={2}
            onClick={onClick}
        />
    );
};
