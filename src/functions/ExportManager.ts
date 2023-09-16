import Konva from "konva";
import { Activity } from "../activity/activity";
import { jsPDF } from "jspdf";
import { ExportOptions } from "../utils/interfaces";

export function ExportManager(
    activity: Activity,
    stageRef: React.MutableRefObject<Konva.Stage | null>,
    selection: string[],
    setSelection: React.Dispatch<React.SetStateAction<string[]>>
): ExportOptions {
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

    type ImageFormat = "png" | "jpeg";

    // Get DataURL of image of stage
    const exportImage = (format: ImageFormat = "png") => {
        if (stageRef.current !== null) {
            const stage = stageRef.current;

            // save position, scale, and selected IDs
            const oldPos = stage.position();
            const oldScale = stage.scale();

            // reset stage
            stage.position({ x: 0, y: 0 });
            stage.scale({ x: 1, y: 1 });

            const dataURL = stage.toDataURL({
                pixelRatio: 2,
                x: 0,
                y: 0,
                width: exportSize.width,
                height: exportSize.height,
                quality: 1,
                mimeType: "image/" + format,
            });

            // restore stage and selected IDs
            stage.position(oldPos);
            stage.scale(oldScale);

            return dataURL;
        }
    };

    const exportPNG = () => {
        const dataURL = exportImage("png");
        if (dataURL !== undefined) {
            downloadURI(dataURL, activity.name + ".png");
        }
    };

    const exportJPEG = () => {
        const dataURL = exportImage("jpeg");
        if (dataURL !== undefined) {
            downloadURI(dataURL, activity.name + ".jpeg");
        }
    };

    const exportPDF = () => {
        if (stageRef.current !== null) {
            const stage = stageRef.current;

            var pdf = new jsPDF("l", "px", [
                exportSize.width,
                exportSize.height,
            ]);
            pdf.setTextColor("#000000");

            // first add texts
            (stage.find("Text") as Konva.Text[]).forEach((text) => {
                const size = text.fontSize() / 0.75; // convert pixels to points
                pdf.setFontSize(size);
                pdf.text(text.text(), text.x(), text.y(), {
                    baseline: "top",
                    angle: -text.getAbsoluteRotation(),
                });
            });

            // then put image on top of texts (so texts are not visible)
            const imageDataURL = exportImage("png");
            if (imageDataURL !== undefined) {
                pdf.addImage(
                    imageDataURL,
                    "PNG",
                    0,
                    0,
                    exportSize.width,
                    exportSize.height
                );

                pdf.save(activity.name + ".pdf");
            }
        }
    };

    return {
        exportPNG,
        exportJPEG,
        exportPDF,
    };
}
