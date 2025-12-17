const Loading = (props: { message: string }) => {
  return (
    <div className="p-8 max-w-4xl mx-auto text-center">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{props.message}...</h1>
    </div>
  );
};
export default Loading;
