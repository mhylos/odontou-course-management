interface NavigationBarProps {
  menuItems: string[];
}

export default function NavigationBar({ menuItems }: NavigationBarProps) {
  return (
    <div className="w-full border-b-4 border-primary flex justify-between">
      {menuItems.map((item) => (
        <button
          key={item}
          className="border-solid border-gray-100 py-2 px-3 border-x-2 border-t-2 rounded-t "
        >
          {item}
        </button>
      ))}
    </div>
  );
}
