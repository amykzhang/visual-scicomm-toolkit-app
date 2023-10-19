import { Line } from "react-konva";
import { LineProp } from "../utils/interfaces";
import Konva from "konva";
import { useEffect, useRef } from "react";
import constants from "../utils/constants";

interface LineElementProp {
    line: LineProp;
    draggable: boolean;
    // handleDragStart: () => void;
    handleChange: (id: string, attributes: any) => void;
}

const LineElement = ({ line, draggable, handleChange }: LineElementProp) => {
    const lineRef = useRef<Konva.Line | null>(null);

    // Backdoor set line cap (Konva Bug, can't set linecap with string)
    useEffect(() => {
        lineRef.current?.lineCap("round");
        // eslint-disable-next-line
    }, [lineRef.current]);

    // Update width and height when the element is created
    useEffect(() => {
        if (line.width === undefined && line.height === undefined) {
            handleChange(line.id, {
                width: lineRef.current?.width(),
                height: lineRef.current?.height(),
            });
        }
        // eslint-disable-next-line
    }, []);

    return (
        <Line
            {...line}
            {...constants.line}
            ref={lineRef}
            draggable={draggable}
            // onDragStart={handleDragStart}
            onDragEnd={(e) =>
                handleChange(line.id, {
                    x: e.target.x(),
                    y: e.target.y(),
                })
            }
            onTransform={(e) => {
                if (lineRef.current !== null) {
                    const node = lineRef.current;
                    const scaledPoints = node
                        .points()
                        .map((point, i) =>
                            i % 2 === 0 ? point * node.scaleX() : point * node.scaleY()
                        );

                    node.scaleX(1);
                    node.scaleY(1);
                    node.points(scaledPoints);
                }
            }}
            onTransformEnd={() => {
                if (lineRef.current !== null) {
                    const node = lineRef.current;
                    const scaledPoints = node
                        .points()
                        .map((point, i) =>
                            i % 2 === 0 ? point * node.scaleX() : point * node.scaleY()
                        );

                    node.scaleX(1);
                    node.scaleY(1);
                    handleChange(line.id, {
                        x: node.x(),
                        y: node.y(),
                        width: node.width(),
                        height: node.height(),
                        points: scaledPoints,
                        rotation: node.rotation(),
                    });
                }
            }}
        />
    );
};

export default LineElement;
