import React, { ReactElement } from 'react';
export type ReactDragRotateProps = {
    children: ReactElement;
    onRotateStart?: (e: any, element: HTMLElement, angle: number) => void;
    onRotate?: (e: any, element: HTMLElement, angle: number) => void;
    onRotateStop?: (e: any, element: HTMLElement, angle: number) => void;
    canRotate?: boolean;
};
export declare function getTransformMatrix(element: HTMLElement): number[];
declare const ReactDragRotate: React.FC<ReactDragRotateProps>;
export default ReactDragRotate;
