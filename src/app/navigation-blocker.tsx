import { PropsWithChildren } from "react";

const NavigationBlocker = ({ children }: PropsWithChildren) => {
    return (
        <>
            {children}
            <script defer>
                {`
                    if (document.body) {
                        document.body.addEventListener('touchstart', (e) => {
                            let x = e.pageX;
                            if (!x) x = e.touches[0].pageX;
                            let edge = 30;
                            if (x >= edge && x <= window.innerWidth - edge) return;

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