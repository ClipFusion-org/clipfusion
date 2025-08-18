import { useState, useRef, useEffect, RefObject } from 'react';

interface UseDragOptions {
    resizeCursor?: boolean;
}

interface DragHookReturn {
    dragX: number,
    dragY: number,
    ref: RefObject<HTMLElement | null>,
    dragging: boolean,
    mouseX: number,
    mouseY: number
}

export default function useDrag(options: UseDragOptions = { resizeCursor: true }): DragHookReturn {
    const ref = useRef<HTMLElement>(null);
    const [dragX, setDeltaX] = useState(0);
    const [dragY, setDeltaY] = useState(0);
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);
    const [dragging, setDragging] = useState(false);
    const posRef = useRef({ lastX: 0, lastY: 0 });

    const listenerOptions: AddEventListenerOptions = {
        passive: false
    };

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const onDragBegin = (x: number, y: number, e: Event) => {
            setDragging(true);
            posRef.current.lastX = x;
            posRef.current.lastY = y;
            if (options.resizeCursor) {
                document.body.style.cursor = 'ew-resize';
            }
            e.preventDefault();
        };

        const onDragMove = (x: number, y: number) => {
            if (!dragging) return;

            const dx = x - posRef.current.lastX;
            const dy = y - posRef.current.lastY;

            setDeltaX(dx);
            setDeltaY(dy);
            setMouseX(x);
            setMouseY(y);

            posRef.current.lastX = x;
            posRef.current.lastY = y;
        }

        const onDragEnd = () => {
            setDragging(false);
            setDeltaX(0);
            setDeltaY(0);
            setMouseX(0);
            setMouseY(0);
            if (options.resizeCursor) {
                document.body.style.cursor = '';
            }
        };

        const onMouseDown = (e: MouseEvent) => {
            onDragBegin(e.pageX, e.pageY, e);
        };

        const onMouseMove = (e: MouseEvent) => {
            onDragMove(e.pageX, e.pageY);
        };

        const onTouchStart = (e: TouchEvent) => {
            onDragBegin(e.touches[0].clientX, e.touches[0].clientY, e);
        };

        const onTouchMove = (e: TouchEvent) => {
            onDragMove(e.touches[0].clientX, e.touches[0].clientY);
        };

        el.addEventListener('mousedown', onMouseDown, listenerOptions);
        window.addEventListener('mousemove', onMouseMove, listenerOptions);
        window.addEventListener('mouseup', onDragEnd, listenerOptions);

        el.addEventListener('touchstart', onTouchStart, listenerOptions)
        window.addEventListener('touchmove', onTouchMove, listenerOptions);
        window.addEventListener('touchend', onDragEnd, listenerOptions);
        window.addEventListener('touchcancel', onDragEnd, listenerOptions);

        return () => {
            el.removeEventListener('mousedown', onMouseDown, listenerOptions);
            window.removeEventListener('mousemove', onMouseMove, listenerOptions);
            window.removeEventListener('mouseup', onDragEnd, listenerOptions);

            el.removeEventListener('touchstart', onTouchStart, listenerOptions)
            window.removeEventListener('touchmove', onTouchMove, listenerOptions);
            window.removeEventListener('touchend', onDragEnd, listenerOptions);
            window.removeEventListener('touchcancel', onDragEnd, listenerOptions);
        };
    }, [options.resizeCursor, ref, dragging]);

    return {
        dragX,
        dragY,
        ref,
        dragging,
        mouseX, mouseY
    };
}
