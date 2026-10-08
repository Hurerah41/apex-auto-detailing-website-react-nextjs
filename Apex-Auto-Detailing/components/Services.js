import SourceMarkup from './SourceMarkup';

export default function Services({ markup, cursorMarkup }) {
  return <>
    <SourceMarkup markup={markup} />
    <SourceMarkup markup={cursorMarkup} />
  </>;
}