import React, { type FC, type PropsWithChildren, useEffect, useState } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';

interface LazyComponentProps {
    skeleton: React.ReactNode;
}

/**
 * A component that only renders its children once it has come into view. Until then, it renders a provided skeleton component.
 * The child component should be a dynamic import using React.lazy for this to be effective.
 */
const LazyComponent: FC<PropsWithChildren<LazyComponentProps>> = ({
    skeleton,
    children
}) => {
    const { isIntersecting, ref } = useIntersectionObserver();
    const [ hasIntersected, setHasIntersected ] = useState(false);
    useEffect(() => {
        if (isIntersecting) {
            setHasIntersected(true);
        }
    }, [ isIntersecting ]);

    return hasIntersected ? (
        // NOTE: This is wrapped in a fragment to suppress an error about inconsistent return types.
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>{children}</>
    ) : (
        <div ref={ref}>
            {skeleton}
        </div>
    );
};

export default LazyComponent;
