import React, {
  useRef,
  useState,
  useEffect,
  ReactElement,
} from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const rotateHandleStyles = css`
  .rotate-handle-holder {
    width: 1px;
    height: 20px;
    top: -42px;
    margin-left: 50%;
    background-color: black;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    position: relative;
  }

  .rotate-handle-holder .rotate-handle {
    width: 30px;
    height: 30px;
    top: -32px;
    left: -14px;
    cursor: pointer;
    border-radius: 50%;
    border: 1px solid black;
    background-color: rgb(43, 108, 176);
    position: relative;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  }

  .rotate-handle-holder .rotate-handle::before {
    content: '';
    display: inline-block;
    width: 25px;
    height: 25px;
    background: #ffffff;
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z'/%3E%3C/svg%3E");
    mask-size: contain;
    mask-position: 2px 2px;
    mask-repeat: no-repeat;
  }
`;

const RotateHandleWrapper = styled.div`
  ${rotateHandleStyles}
`;

export type ReactDragRotateProps = {
  children: ReactElement;
  onRotateStart?: (e: any, element: HTMLElement, angle: number) => void;
  onRotate?: (e: any, element: HTMLElement, angle: number) => void;
  onRotateStop?: (e: any, element: HTMLElement, angle: number) => void;
  canRotate?: boolean;
};

export function getTransformMatrix(element: HTMLElement) {
  const transformProperty = window.getComputedStyle(element).transform;
  const matrix = new DOMMatrix(transformProperty);
  const matrixArray = [
    matrix.a,
    matrix.b,
    matrix.c,
    matrix.d,
    matrix.e,
    matrix.f,
  ];
  return matrixArray;
}

const ReactDragRotate: React.FC<ReactDragRotateProps> = ({
  children,
  onRotateStart,
  onRotate,
  onRotateStop,
  canRotate = true,
}: ReactDragRotateProps) => {
  const rotatableRef = useRef<HTMLElement | null>(null);
  const rotatingRef = useRef<boolean>(false);
  const [angle, setAngle] = useState<number>(0);

  const handleStartRotate = (e: any) => {
    rotatingRef.current = true;

    if (e.button === 2) {
      return;
    }

    e.stopPropagation();
    document.addEventListener('mousemove', handleRotate);

    if (onRotateStart) {
      onRotateStart(e, rotatableRef.current!, angle);
    }
  };

  const handleRotate = (e: any) => {
    e.stopPropagation();
    e.preventDefault();

    if (!rotatingRef.current || !rotatableRef.current) {
      return;
    }

    const bounds = rotatableRef.current.getBoundingClientRect();
    const centerX = bounds.left + rotatableRef.current!.clientWidth / 2;
    const centerY = bounds.top + rotatableRef.current!.clientHeight / 2;
    const mouseX =
      e.pageX -
      (document.documentElement.scrollLeft || document.body.scrollLeft);
    const mouseY =
      e.pageY - (document.documentElement.scrollTop || document.body.scrollTop);
    const angleRad = Math.atan2(mouseX - centerX, -(mouseY - centerY));
    const angleDeg = angleRad * (180 / Math.PI);

    const matrixArray = getTransformMatrix(rotatableRef.current!);
    rotatableRef.current!.style.transform = `translate(${matrixArray[4]}px, ${matrixArray[5]}px) rotate(${angleDeg}deg)`;

    const angleNormalized = angleDeg > 0 ? angleDeg : 360 + angleDeg;
    setAngle(angleNormalized);

    if (onRotate) {
      onRotate(e, rotatableRef.current!, angleNormalized);
    }
  };

  const handleStopRotate = (e: any) => {
    rotatingRef.current = false;

    if (!rotatingRef.current) {
      return;
    }

    e.preventDefault();
    document.removeEventListener('mousemove', handleRotate);

    if (onRotateStop) {
      onRotateStop(e, rotatableRef.current!, angle);
    }
  };

  const addHandle = () => {
    if (!canRotate) {
      return;
    }

    if (rotatableRef.current) {
      const handleContainers = rotatableRef.current.querySelectorAll(
        '.rotate-handle-holder',
      );
      handleContainers.forEach((element: Node) =>
        element.parentNode!.removeChild(element),
      );

      const handleContainer = document.createElement('div');
      handleContainer.classList.add('rotate-handle-holder');

      const handle = document.createElement('div');
      handle.classList.add('rotate-handle');
      handleContainer.appendChild(handle);
      rotatableRef.current.appendChild(handleContainer);

      handle.addEventListener('mousedown', handleStartRotate);
      document.addEventListener('mouseup', handleStopRotate);
    }
  };

  const cleanUp = () => {
    if (rotatableRef.current) {
      const handleElements =
        rotatableRef.current.querySelectorAll('.rotate-handle');
      document.removeEventListener('mouseup', handleStopRotate);

      handleElements.forEach((element: Node) => {
        element.removeEventListener('mousedown', handleStartRotate);
      });

      const handleContainers = rotatableRef.current.querySelectorAll(
        '.rotate-handle-holder',
      );
      handleContainers.forEach((element: Node) =>
        element.parentNode!.removeChild(element),
      );
    }
  };

  useEffect(() => {
    addHandle();
    return cleanUp;
  }, [rotatableRef.current]);

  const cloneChildren = React.Children.toArray(children);

  return (
    <RotateHandleWrapper>
      {React.cloneElement(cloneChildren[0] as React.ReactElement, {
        ref: rotatableRef,
      })}
    </RotateHandleWrapper>
  );
};

ReactDragRotate.propTypes = {
  children: PropTypes.element.isRequired,
  onRotateStart: PropTypes.func,
  onRotate: PropTypes.func,
  onRotateStop: PropTypes.func,
  canRotate: PropTypes.bool,
};

export default ReactDragRotate;
