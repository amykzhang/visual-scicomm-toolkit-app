import { useCallback, useEffect, useState } from "react";

export const KeyPressManager = () => {
    const [shiftKey, setShiftKey] = useState(false);
    const [ctrlKey, setCtrlKey] = useState(false);
    const [altKey, setAltKey] = useState(false);
    const [metaKey, setMetaKey] = useState(false);

    const onKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.shiftKey) setShiftKey(true);
        if (e.ctrlKey) setCtrlKey(true);
        if (e.altKey) setAltKey(true);
        if (e.metaKey) setMetaKey(true);
    }, []);

    const onKeyUp = useCallback((e: KeyboardEvent) => {
        if (!e.shiftKey) setShiftKey(false);
        if (!e.ctrlKey) setCtrlKey(false);
        if (!e.altKey) setAltKey(false);
        if (!e.metaKey) setMetaKey(false);
    }, []);

    useEffect(() => {
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
        };
    }, []);

    return { shiftKey, ctrlKey, altKey, metaKey };
};
