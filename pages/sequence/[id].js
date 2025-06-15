import Header from "@/components/Header";
import { PrismaClient } from "@prisma/client";

export default function SequencePage({ sequence }) {
  if (!sequence) {
    return (
      <>
        <Header />
        <div className="container">
          <h1>Séquence introuvable</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container">
        <h1 className="text-2xl font-bold mb-4">{sequence.title}</h1>
        <p className="mb-4"><strong>Compétence :</strong> {sequence.content.competence}</p>
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{
            __html: sequence.content.seancesDetaillees,
          }}
        />
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const prisma = new PrismaClient();
  const sequence = await prisma.sequence.findUnique({
    where: { id: params.id },
  });

  if (!sequence) {
    return { props: { sequence: null } };
  }

  return {
    props: {
      sequence: {
        id: sequence.id,
        title: sequence.title,
        content: sequence.content,
      },
    },
  };
}
