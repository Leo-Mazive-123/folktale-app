import Link from "next/link";
import { Tale } from "../../types";

interface Props {
  tale: Tale;
}

export default function TaleCard({ tale }: Props) {
  return (
    <Link href={`/${tale.id}`}>
      <div className="border p-4 rounded shadow hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer bg-white dark:bg-gray-800">
        <h2 className="font-semibold text-xl mb-2 dark:text-white">{tale.title}</h2>
        <p className="text-gray-700 dark:text-gray-300 line-clamp-4">{tale.text}</p>
        <div className="mt-3 flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">{tale.nation}</span>
          <button className="text-green-500 rounded-full hover:text-green-600 text-sm font-medium transition">
            Read More
          </button>
        </div>
      </div>
    </Link>
  );
}
