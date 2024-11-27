import Link from "next/link";
import { FC } from "react";

interface NotFoundProps {}

const NotFound: FC<NotFoundProps> = ({}) => {
  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <Link
        href='/'
        className='border-black/30 dark:border-white/30 border px-5 py-2 rounded-lg'
      >
        Go to home
      </Link>
    </div>
  );
};

export default NotFound;
