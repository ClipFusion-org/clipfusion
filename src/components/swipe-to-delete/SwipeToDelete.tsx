'use client'
import { useRef, useState, useEffect, FC, ReactNode } from 'react'

type SwipeToDeleteProps = {
    children: ReactNode;
    onDelete: () => void;
    height?: number ;
    backgroundClass?: string;
    deleteText?: string;
    fadeOnDeletion?: boolean;
}

const SwipeToDelete: FC<SwipeToDeleteProps> = ({
    children,
    onDelete,
    height = 60,
    backgroundClass = 'oklch(63.7% 0.237 25.331)',
    deleteText = 'Delete',
    fadeOnDeletion = true
}) => {
    const container = useRef<HTMLDivElement>(null);
    const content = useRef<HTMLDivElement>(null);
    const text = useRef<HTMLButtonElement>(null);

    // drag state
    const [dragX, setDragX] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [velocity, setVelocity] = useState(0);
    const lastTimeRef = useRef<number>(0);
    const lastXRef = useRef<number>(0);

    // collapse state
    const [isCollapsing, setIsCollapsing] = useState(false);

    // measure width and thresholds
    const width = container.current?.offsetWidth ?? window.innerWidth;
    const threshold = width / 2;
    const rubberMax = width * 0.7;

    // rubber-band effect
    const rubber = (delta: number, customRubberMax?: number) => {
        const max = customRubberMax ?? rubberMax;
        const sign = delta < 0 ? -1 : 1;
        const abs = Math.abs(delta);
        if (abs <= max) return delta;
        return sign * (max + Math.sqrt(abs - max));
    }

    // do we show the sticky delete inside content?
    const isSticky = dragX < -rubberMax;

    // pointer start
    const handleStart = (pageX: number) => {
        if (isCollapsing) return;
        setDragging(true);
        setStartX(pageX - dragX);
        lastTimeRef.current = performance.now();
        lastXRef.current = pageX;
        content.current?.classList.remove('ios-ease');
    };

    // pointer move
    const handleMove = (pageX: number) => {
        if (!dragging) return;
        const now = performance.now();
        const dt = now - lastTimeRef.current;
        const dx = pageX - lastXRef.current;
        setVelocity(dx / dt * 1000);
        lastTimeRef.current = now;
        lastXRef.current = pageX;

        const raw = pageX - startX;
        const x = dragX < 0 ? rubber(raw) : rubber(raw, width * 0.1);
        setDragX(x);
    };

    const handleDelete = () => {
        // slide away
        content.current?.classList.add('ios-ease');
        setDragX(-width);

        // collapse after a slight delay (via CSS)
        setIsCollapsing(true);
        setTimeout(onDelete, 300); // matches the CSS timings below
    };

    // pointer end
    const handleEnd = () => {
        if (!dragging) return;
        setDragging(false);

        const shouldDelete =
            Math.abs(dragX) > threshold ||
            velocity < -1000;
        if (!shouldDelete) {
            content.current?.classList.add('ios-ease');
            text.current?.classList.add('ios-ease');
            const textWidth = text.current ? text.current.getBoundingClientRect().width : 0;
            if (dragX < -50 && text.current) setDragX(-textWidth * 1.5);
            else setDragX(0);
            return;
        }

        handleDelete();
    }

    useEffect(() => {
        const node = container.current
        if (!node) return
        const onDown = (e: PointerEvent) => {
            node.setPointerCapture(e.pointerId)
            handleStart(e.pageX)
        }
        const onMove = (e: PointerEvent) => handleMove(e.pageX)
        const onUp = (e: PointerEvent) => {
            handleEnd()
            node.releasePointerCapture(e.pointerId)
        }
        node.addEventListener('pointerdown', onDown)
        node.addEventListener('pointermove', onMove)
        node.addEventListener('pointerup', onUp)
        return () => {
            node.removeEventListener('pointerdown', onDown)
            node.removeEventListener('pointermove', onMove)
            node.removeEventListener('pointerup', onUp)
        }
    }, [dragging, dragX, velocity])

    const deleteTransform = isCollapsing
        ? `translateX(calc(${dragX}px + 5rem))`
        : (isSticky ? `translateX(calc(${dragX}px + 5rem))` : `translateX(max(0rem, calc(${dragX}px + 5rem)))`);

    const opacityTransparent = fadeOnDeletion ? 0 : 1;

    const background = dragX < 0
        ? isCollapsing ? (opacityTransparent == 0 ? 'transparent' : backgroundClass) : backgroundClass 
        : 'transparent';

    return (
        <div
            ref={container}
            className="relative overflow-hidden select-none"
            style={{
                height: isCollapsing ? 0 : height,
                transition: isCollapsing
                    ? 'height 300ms cubic-bezier(0.24, 1.04, 0.56, 1)'
                    : undefined,
            }}
        >
            {/* Fixed red background + delete text */}
            <div
                className={`absolute inset-0 flex items-center justify-end pr-4`}
                style={{
                    background: background,
                    transition: dragX > 1 ? '' : 'background 300ms'
                }}
            >
                <button className="text-white font-semibold h-full" style={{
                    transform: deleteTransform,
                    transition: 'transform 300ms cubic-bezier(0.24, 1.04, 0.56, 1), opacity 300ms',
                    opacity: isCollapsing ? opacityTransparent : 1
                }} onClick={handleDelete} ref={text}>
                    {deleteText}
                </button>
            </div>

            {/* Swipeable content */}
            <div
                ref={content}
                className="relative ios-ease"
                style={{
                    position: 'absolute',
                    inset: 0,
                    transform: `translateX(${dragX}px)`,
                    transition: dragging
                        ? ''
                        : 'transform 300ms cubic-bezier(0.24, 1.04, 0.56, 1)',
                    touchAction: 'none',
                    pointerEvents: 'none',
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                    transformStyle: 'preserve-3d'
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default SwipeToDelete;