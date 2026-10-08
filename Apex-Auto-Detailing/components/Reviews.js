import SourceMarkup from './SourceMarkup';

export default function Reviews({ markup, modalMarkup }) {
  return <>
    <SourceMarkup markup={markup} />
    <SourceMarkup markup={modalMarkup} />
  </>;
}