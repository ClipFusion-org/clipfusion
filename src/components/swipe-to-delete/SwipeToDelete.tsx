'use client';
import useBrowserEngine from '@/hooks/useBrowserEngine';
import React, { useRef, useState, useEffect, FC, ReactNode, CSSProperties } from 'react'

type SwipeToDeleteProps = {
    children: ReactNode;
    onDelete: () => void;
    height?: number | string;
    backgroundClass?: string;
    deleteText?: string;
    fadeOnDeletion?: boolean | `${boolean}`;
    useBoldDeleteFont?: boolean | `${boolean}`;
    threshold?: number;
}

const SwipeToDelete: FC<SwipeToDeleteProps> = ({
    children,
    onDelete,
    height = 60,
    backgroundClass = 'oklch(63.7% 0.237 25.331)',
    deleteText = 'Delete',
    fadeOnDeletion = true,
    useBoldDeleteFont = true,
    threshold = 75
}) => {
    const container = useRef<HTMLDivElement>(null);
    const content = useRef<HTMLDivElement>(null);
    const text = useRef<HTMLButtonElement>(null);

    const browser = useBrowserEngine();

    const applyBlurFix = (style: CSSProperties) => {
        if (browser == 'Blink') {
            style.willChange = undefined;
        }
        return style;
    };

    // drag state
    const [dragX, setDragX] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [velocity, setVelocity] = useState(0);
    const [velocityY, setVelocityY] = useState(0);
    const [allowOverscroll, setAllowOverscroll] = useState(false);
    const [isCollapsing, setIsCollapsing] = useState(false);
    const [forceTransparentBackground, setForceTransparentBackground] = useState(false);
    const lastTimeRef = useRef<number>(0);
    const lastXRef = useRef<number>(-1);
    const lastYRef = useRef<number>(-1);

    // measure width and thresholds
    const width = container.current?.offsetWidth ?? 0;
    const rubberMax = width * threshold / 100;

    // rubber-band effect
    const rubber = (delta: number, customRubberMax?: number) => {
        const max = customRubberMax ?? rubberMax;
        const sign = delta < 0 ? -1 : 1;
        const abs = Math.abs(delta);
        if (abs <= max) return delta;
        return sign * (max + Math.sqrt(abs - max));
    }

    const isSticky = dragX < -rubberMax;

    const handleStart = (pageX: number) => {
        if (isCollapsing) return;
        setDragging(true);
        setStartX(pageX - dragX);
        lastTimeRef.current = performance.now();
        lastXRef.current = pageX;
        content.current?.classList.remove('ios-ease');
    };

    const handleMove = (pageX: number, pageY: number) => {
        if (!dragging) return;
        const now = performance.now();
        const dt = now - lastTimeRef.current;
        if (lastXRef.current === -1 || lastYRef.current === -1) {
            lastXRef.current = pageX;
            lastYRef.current = pageY;
            return;
        }
        const dx = pageX - lastXRef.current;
        const dy = pageY - lastYRef.current;
        const vX = dx / dt * 1000;
        const vY = dy / dt * 1000;
        setVelocity(vX);
        setVelocityY(vY);
        lastTimeRef.current = now;
        lastXRef.current = pageX;
        lastYRef.current = pageY;

        const raw = pageX - startX;
        const x = dragX < 0 ? rubber(raw) : rubber(raw, width * 0.1);
        if ((Math.abs(dragX) === 0 ? Math.abs(vY) < window.innerHeight * 0.05 && Math.abs(vX) > Math.abs(vY) : true)) {
            if (x < -1) setAllowOverscroll(true);
            if (x <= 0 || (allowOverscroll && x >= 0)) {
                setDragX(x);
                document.body.classList.add('no-scroll');
            }

        } else {
            setDragX(0);
            setAllowOverscroll(false);
            document.body.classList.remove('no-scroll');
        }

    };

    const handleDelete = () => {
        // slide away
        content.current?.classList.add('ios-ease');
        setDragX(-width);

        setIsCollapsing(true);
        setTimeout(onDelete, 300); // matches the CSS timings below
    };

    let transparencyTimeout: NodeJS.Timeout | null = null;

    const handleEnd = () => {
        if (!dragging) return;
        setDragging(false);

        const shouldDelete = isSticky || velocity < -1000;
        setAllowOverscroll(false);
        document.body.classList.remove('no-scroll');
        if (Math.abs(velocityY) > window.innerHeight * 0.05 && Math.abs(dragX) < 20) {
            setDragX(0);
            if (transparencyTimeout) {
                clearTimeout(transparencyTimeout);
            }
            setForceTransparentBackground(true);
            transparencyTimeout = setTimeout(() => setForceTransparentBackground(false), 200);
            return;
        }
        if (!shouldDelete) {
            content.current?.classList.add('ios-ease');
            text.current?.classList.add('ios-ease');
            const textWidth = text.current ? text.current.getBoundingClientRect().width : 0;
            if (((velocity < 0 && Math.abs(velocity) > 10) || dragX < -textWidth * 1.5 && velocity > 0) && text.current) {
                if (velocity > window.innerWidth * 0.15) {
                    setDragX(0);
                } else {
                    setDragX(-textWidth * 1.5);
                }
            } else if (allowOverscroll && dragX > 0 && velocity > 0) {
                setDragX(0);
                if (transparencyTimeout) {
                    clearTimeout(transparencyTimeout);
                }
                setForceTransparentBackground(true);
                transparencyTimeout = setTimeout(() => setForceTransparentBackground(false), 200);
            } else setDragX(0);
            return;
        }

        handleDelete();
    }

    useEffect(() => {
        const node = window;
        if (!node || !container.current) return;

        const eventOutsideOfContainer = (e: Event) => {
            return !(container.current?.contains(e.target as Node));
        };

        const handleMouseStart = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (eventOutsideOfContainer(e)) {
                setDragX(0);
                return;
            }
            handleStart(e.pageX);
        };

        const handleMouseMove = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (eventOutsideOfContainer(e)) {
                setDragX(0);
                return;
            }

            handleMove(e.pageX, e.pageY);
        };

        const handleMouseEnd = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            handleEnd();
        }

        const options: AddEventListenerOptions = {
            capture: true,
        };

        node.addEventListener("pointerdown", handleMouseStart, options);
        node.addEventListener("pointermove", handleMouseMove, options);
        node.addEventListener("pointerup", handleMouseEnd, options);
        node.addEventListener("pointercancel", handleMouseEnd, options);

        return () => {
            node.removeEventListener("pointerdown", handleMouseStart, options);
            node.removeEventListener("pointermove", handleMouseMove, options);
            node.removeEventListener("pointerup", handleMouseEnd, options);
            node.removeEventListener("pointercancel", handleMouseEnd, options);
        };
    }, [dragging, dragX, velocity, velocityY, container]);

    const deleteTransform = isCollapsing
        ? `translateX(calc(${dragX}px + 5rem))`
        : (isSticky ? `translateX(calc(${dragX}px + 5rem))` : `translateX(max(0rem + ${dragX * 0.07}px, calc(${dragX}px + 5rem)))`);

    const opacityTransparent = fadeOnDeletion ? 0 : 1;
    const backgroundTransparent = opacityTransparent == 0 ? 'transparent' : backgroundClass;

    let background = backgroundClass;

    if (isCollapsing) {
        background = isCollapsing ? backgroundTransparent : backgroundClass;
    }

    if (allowOverscroll && dragX > 1 || forceTransparentBackground) {
        background = 'transparent';
    }

    return (
        <div
            ref={container}
            style={{
                position: 'relative',
                overflow: 'hidden',
                userSelect: 'none',
                height: isCollapsing ? 0 : height,
                transition: isCollapsing
                    ? 'height 300ms cubic-bezier(0.24, 1.04, 0.56, 1)'
                    : undefined,
                willChange: 'height'
            }}
        >
            {/* Fixed red background + delete text */}
            <div
                className={`inset-0 flex items-center justify-end`}
                style={{
                    background: background,
                    position: 'absolute',
                    marginTop: '1px',
                    marginBottom: '1px',
                    paddingRight: '1rem',
                    transition: dragX > 1 ? '' : 'background 300ms',
                    willChange: 'background'
                }}
            >
                <button style={{
                    transform: deleteTransform,
                    transition: 'transform 300ms cubic-bezier(0.24, 1.04, 0.56, 1), opacity 300ms',
                    color: 'white',
                    fontWeight: useBoldDeleteFont ? 600 : '',
                    height: '100%',
                    opacity: isCollapsing ? opacityTransparent : 1,
                    willChange: `transform, opacity`
                }} onClick={handleDelete} ref={text}>
                    {deleteText}
                </button>
            </div>

            {/* Swipeable content */}
            <div
                ref={content}
                className="ios-ease"
                style={applyBlurFix({
                    position: 'relative',
                    inset: 0,
                    height: '100%',
                    transform: `translateX(${Math.floor(dragX)}px)`,
                    transition: dragging
                        ? ''
                        : 'transform 300ms cubic-bezier(0.24, 1.04, 0.56, 1)',
                    willChange: 'transform'
                })}
            >
                {children}
            </div>
        </div>
    );
};

export default SwipeToDelete;