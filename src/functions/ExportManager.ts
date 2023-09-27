import Konva from "konva";
import { Activity } from "../activity/activity";
import { jsPDF } from "jspdf";
import { useCallback, useEffect, useState } from "react";

export function ExportManager(
    activity: Activity,
    stageRef: React.MutableRefObject<Konva.Stage | null>,
    setTransformFlag: React.Dispatch<React.SetStateAction<boolean>>
) {
    const exportSize = activity.canvas_size;

    const [exportType, setExportType] = useState<"png" | "jpeg" | "pdf" | null>(null);

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
    const exportImage = useCallback(
        (format: ImageFormat = "png") => {
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
        },
        [exportSize.width, exportSize.height, stageRef]
    );

    const exportPNG = useCallback(() => {
        const dataURL = exportImage("png");
        if (dataURL !== undefined) {
            downloadURI(dataURL, activity.name + ".png");
        }
    }, [activity.name, exportImage]);

    const exportJPEG = useCallback(() => {
        const dataURL = exportImage("jpeg");
        if (dataURL !== undefined) {
            downloadURI(dataURL, activity.name + ".jpeg");
        }
    }, [activity.name, exportImage]);

    const exportPDF = useCallback(() => {
        if (stageRef.current !== null) {
            const stage = stageRef.current;

            var pdf = new jsPDF("l", "px", [exportSize.width, exportSize.height]);
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
                pdf.addImage(imageDataURL, "PNG", 0, 0, exportSize.width, exportSize.height);

                pdf.save(activity.name + ".pdf");
            }
        }
    }, [activity.name, exportImage, exportSize, stageRef]);

    const startExportProcess = (type: "png" | "jpeg" | "pdf" | null) => {
        setTransformFlag(false);
        setExportType(type);
    };

    // Effect for catching when exportType is set other than null and begin export process
    useEffect(() => {
        if (exportType !== null) {
            switch (exportType) {
                case "png":
                    exportPNG();
                    break;
                case "jpeg":
                    exportJPEG();
                    break;
                case "pdf":
                    exportPDF();
                    break;
            }
            setExportType(null);
            setTransformFlag(true);
        }
    }, [exportType, setTransformFlag, exportPNG, exportJPEG, exportPDF]);

    return startExportProcess;
}
