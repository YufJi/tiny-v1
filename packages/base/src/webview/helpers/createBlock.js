import { h, Fragment } from 'omi';

export default function createBlock(element, props) {
  let arrayElements = element;
  if (!Array.isArray(arrayElements)) {
    arrayElements = [arrayElements];
  }
  if (Fragment) {
    return <Fragment {...props}>{arrayElements}</Fragment>;
  } else {
    return arrayElements;
  }
}
