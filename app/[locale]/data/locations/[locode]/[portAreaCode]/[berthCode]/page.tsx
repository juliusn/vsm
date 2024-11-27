import BerthDetails from './BerthDetails';

export default async function BerthCodePage({
  params: { locode, portAreaCode, berthCode },
}: {
  params: { locode: string; portAreaCode: string; berthCode: string };
}) {
  return (
    <BerthDetails
      locode={locode}
      portAreaCode={portAreaCode}
      berthCode={berthCode}
    />
  );
}
