export default function NotFoundPage() {
  return (
    <div className="w-[90%] flex flex-col gap-10 items-center justify-center font-bold text-2xl m-auto mt-20 mb-20">
      <h1>
        {
          "We couldn't find what you were looking for. Please try navigating to a different page."
        }
      </h1>
      <p>404 &ndash; Not Found</p>
    </div>
  );
}
