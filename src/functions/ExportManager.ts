import { Stage } from "konva/lib/Stage";
import { Activity } from "../activity/activity";

export const ExportManager = (
    stageRef: React.MutableRefObject<Stage | null>,
    activity: Activity
) => {
    const exportSize = activity.canvas_size;

    function downloadURI(uri: string, name: string) {
        const link = document.createElement("a");
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        link.remove();
    }

    const exportCanvas = () => {
        if (stageRef.current !== null) {
            const stage = stageRef.current;

            const oldPos = stage.position();
            const oldScale = stage.scale();

            console.log(oldPos, oldScale);
            stage.position({ x: 0, y: 0 });
            stage.scale({ x: 1, y: 1 });

            const dataURL = stage.toDataURL({
                pixelRatio: 2,
                x: 0,
                y: 0,
                width: exportSize.width,
                height: exportSize.height,
                quality: 1,
                mimeType: "image/png",
            });

            stage.position(oldPos);
            stage.scale(oldScale);

            downloadURI(dataURL, activity.name + ".png");
        }
    };

    return {
        exportCanvas: exportCanvas,
    };
};
