export default function About({ markup }) {
  return <div dangerouslySetInnerHTML={{ __html: markup }} />;
}