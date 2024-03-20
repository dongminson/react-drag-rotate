'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var PropTypes = require('prop-types');
var styled = require('styled-components');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var PropTypes__default = /*#__PURE__*/_interopDefaultLegacy(PropTypes);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }
  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}

var _templateObject, _templateObject2;
const rotateHandleStyles = styled.css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  .rotate-handle-holder {\n    width: 1px;\n    height: 20px;\n    top: -42px;\n    margin-left: 50%;\n    background-color: black;\n    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);\n    position: relative;\n  }\n\n  .rotate-handle-holder .rotate-handle {\n    width: 30px;\n    height: 30px;\n    top: -32px;\n    left: -14px;\n    cursor: pointer;\n    border-radius: 50%;\n    border: 1px solid black;\n    background-color: rgb(43, 108, 176);\n    position: relative;\n    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);\n  }\n\n  .rotate-handle-holder .rotate-handle::before {\n    content: '';\n    display: inline-block;\n    width: 25px;\n    height: 25px;\n    background: #ffffff;\n    mask: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z'/%3E%3C/svg%3E\");\n    mask-size: contain;\n    mask-position: 2px 2px;\n    mask-repeat: no-repeat;\n  }\n"])));
const RotateHandleWrapper = styled__default["default"].div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  ", "\n"])), rotateHandleStyles);
function getTransformMatrix(element) {
  const transformProperty = window.getComputedStyle(element).transform;
  const matrix = new DOMMatrix(transformProperty);
  const matrixArray = [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f];
  return matrixArray;
}
const ReactDragRotate = _ref => {
  let {
    children,
    onRotateStart,
    onRotate,
    onRotateStop,
    canRotate = true
  } = _ref;
  const rotatableRef = React.useRef(null);
  const rotatingRef = React.useRef(false);
  const [angle, setAngle] = React.useState(0);
  const handleStartRotate = e => {
    rotatingRef.current = true;
    if (e.button === 2) {
      return;
    }
    e.stopPropagation();
    document.addEventListener('mousemove', handleRotate);
    if (onRotateStart) {
      onRotateStart(e, rotatableRef.current, angle);
    }
  };
  const handleRotate = e => {
    e.stopPropagation();
    e.preventDefault();
    if (!rotatingRef.current || !rotatableRef.current) {
      return;
    }
    const bounds = rotatableRef.current.getBoundingClientRect();
    const centerX = bounds.left + rotatableRef.current.clientWidth / 2;
    const centerY = bounds.top + rotatableRef.current.clientHeight / 2;
    const mouseX = e.pageX - (document.documentElement.scrollLeft || document.body.scrollLeft);
    const mouseY = e.pageY - (document.documentElement.scrollTop || document.body.scrollTop);
    const angleRad = Math.atan2(mouseX - centerX, -(mouseY - centerY));
    const angleDeg = angleRad * (180 / Math.PI);
    const matrixArray = getTransformMatrix(rotatableRef.current);
    rotatableRef.current.style.transform = "translate(".concat(matrixArray[4], "px, ").concat(matrixArray[5], "px) rotate(").concat(angleDeg, "deg)");
    const angleNormalized = angleDeg > 0 ? angleDeg : 360 + angleDeg;
    setAngle(angleNormalized);
    if (onRotate) {
      onRotate(e, rotatableRef.current, angleNormalized);
    }
  };
  const handleStopRotate = e => {
    rotatingRef.current = false;
    if (!rotatingRef.current) {
      return;
    }
    e.preventDefault();
    document.removeEventListener('mousemove', handleRotate);
    if (onRotateStop) {
      onRotateStop(e, rotatableRef.current, angle);
    }
  };
  const addHandle = () => {
    if (!canRotate) {
      return;
    }
    if (rotatableRef.current) {
      const handleContainers = rotatableRef.current.querySelectorAll('.rotate-handle-holder');
      handleContainers.forEach(element => element.parentNode.removeChild(element));
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
      const handleElements = rotatableRef.current.querySelectorAll('.rotate-handle');
      document.removeEventListener('mouseup', handleStopRotate);
      handleElements.forEach(element => {
        element.removeEventListener('mousedown', handleStartRotate);
      });
      const handleContainers = rotatableRef.current.querySelectorAll('.rotate-handle-holder');
      handleContainers.forEach(element => element.parentNode.removeChild(element));
    }
  };
  React.useEffect(() => {
    addHandle();
    return cleanUp;
  }, [rotatableRef.current]);
  const cloneChildren = React__default["default"].Children.toArray(children);
  return /*#__PURE__*/React__default["default"].createElement(RotateHandleWrapper, null, /*#__PURE__*/React__default["default"].cloneElement(cloneChildren[0], {
    ref: rotatableRef
  }));
};
ReactDragRotate.propTypes = {
  children: PropTypes__default["default"].element.isRequired,
  onRotateStart: PropTypes__default["default"].func,
  onRotate: PropTypes__default["default"].func,
  onRotateStop: PropTypes__default["default"].func,
  canRotate: PropTypes__default["default"].bool
};
var ReactDragRotate$1 = ReactDragRotate;

exports.ReactDragRotate = ReactDragRotate$1;
