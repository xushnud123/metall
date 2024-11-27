import Link from "next/link";
import { FC, Suspense } from "react";

interface NotFoundProps {}

const NotFound: FC<NotFoundProps> = ({}) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className='w-screen h-screen flex justify-center flex-col gap-3 items-center'>
        <h1>404 - Page Not Found</h1>
        <p>We couldn’t find the page you were looking for.</p>
        <Link
          href='/'
          className='border-black/30 dark:border-white/30 border px-5 py-2 rounded-lg'
        >
          Go to home
        </Link>
      </div>
    </Suspense>
  );
};

export default NotFound;
