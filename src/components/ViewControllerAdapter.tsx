import React, { FunctionComponent, useEffect, useRef } from 'react';

type ViewControllerAdapterProps = {
    controller: string,
    view: string
}

/**
 * An adapter component for the legacy view controllers.
 */
const ViewControllerAdapter: FunctionComponent<ViewControllerAdapterProps> = ({ controller, view }) => {
    const element = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initController = async () => {
            if (!element.current) {
                console.error(`Unexpected null element when creating ViewControllerAdapter ${controller}`);
                return;
            }

            // Load the controller and view
            const [ ControllerFactory, View ] = await Promise.all([
                import(`../controllers/${controller}`),
                import(`../controllers/${view}`)
            ]);

            console.warn('initController', ControllerFactory, View.default);

            // Inject the html content
            // TODO: Translate view
            element.current.innerHTML = View.default;

            // Initialize the controller
            // FIXME: Should support functional controllers also
            new ControllerFactory.default(element.current, {}, {});
            element.current.dispatchEvent(new CustomEvent('viewbeforeshow'));
            element.current.dispatchEvent(new CustomEvent('viewshow'));
        };

        initController();
    }, [ controller, view ]);

    return (
        <div ref={element} />
    );
};

export default ViewControllerAdapter;
