export default function SourceMarkup({ markup }) {
  return <div dangerouslySetInnerHTML={{ __html: markup }} />;
}