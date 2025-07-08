const Loading = (props: { message: string }) => {
  return (
    <div>
      <h1>Cargando {props.message}...</h1>
    </div>
  );
};
export default Loading;
