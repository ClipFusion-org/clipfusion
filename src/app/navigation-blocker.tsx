import { PropsWithChildren } from "react";

/* const NavigationBlocker = (props: PropsWithChildren) => {
    const ref = useRef<HTMLDivElement>(null);
    const browser = useBrowserEngine();

    useEffect(() => {
        const block = (e: TouchEvent) => {
            if (browser !== 'WebKit') return;
            const x = e.touches[0].clientX;
            // is not near edge of view, exit
            const edge = window.innerWidth * 0.05;
            if ((x >= edge && x <= window.innerWidth - edge)) return;
            // prevent swipe to navigate back gesture
            e.preventDefault();
        };

        const options: AddEventListenerOptions = {
            passive: false
        };

        window.addEventListener("touchstart", block, options);

        return () => {
            window.removeEventListener("touchstart", block, options);
        };
    }, [ref, browser]);

    return <div ref={ref} {...props}></div>;
}; */

const NavigationBlocker = ({ children }: PropsWithChildren) => {
    return (
        <>
            {children}
            <script defer>
                {`
                    if (document.body) {
                        document.body.addEventListener('touchstart', (e) => {
                            let x = e.pageX;
                            let y = e.pageY;
                            if (!x) x = e.touches[0].pageX;
                            if (!y) y = e.touches[0].pageY;
                            let edge = 44;
                            console.log(x, y, edge);
                            if (x >= edge && x <= window.innerWidth - edge && y >= edge && y <= window.innerHeight - edge) return;

                            e.preventDefault();
                        }, {
                            passive: false
                        });
                    }
                `}
            </script>
        </>
    )
};

export default NavigationBlocker;