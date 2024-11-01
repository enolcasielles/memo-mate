import Error500 from "@/core/components/errors/error500";
import { exampleAction } from "../actions/example.action";
import ExampleProvider from "../contexts/ChallengeRoomContext";
import ExampleComponent from "../components/ChallengeRoomDescription";

export interface ExampleProps {
  params: {
    param: string;
  };
}

const ExamplePage = async ({ params: { param } }: ExampleProps) => {
  const [error, result] = await exampleAction({
    param: param,
  });

  if (error) return <Error500 message={error.message} />;

  return (
    <ExampleProvider result={result}>
      <div className="bg-white">
        <main className="flex flex-col p-4 pt-16 w-full max-w-7xl m-auto">
          <ExampleComponent />
        </main>
      </div>
    </ExampleProvider>
  );
};

export default ExamplePage;
