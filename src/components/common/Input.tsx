function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`block py-2.5 px-2 w-full text-sm bg-transparent rounded border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary
      disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 disabled:border-gray-300 disabled:placeholder-gray-300 ${props.className}`.trimEnd()}
      placeholder=" "
    />
  );
}

export default Input;
