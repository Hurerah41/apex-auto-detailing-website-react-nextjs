export default function Footer({ markup }) {
  return <div dangerouslySetInnerHTML={{ __html: markup }} />;
}