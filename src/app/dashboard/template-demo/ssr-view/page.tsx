/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import { IProduct } from '../../products/all/api/v1/Model';
import HomePageView from './HomePageView';

const Page = async () => {
  const fetchData = async () => {
    const token = process.env.NEXT_PUBLIC_Token;
    if (!token) {
      console.error('Authentication token not found. Unable to fetch data.');
      return;
    }

    const url = 'https://sh-v7.vercel.app/dashboard/template-demo/all/api/v1?page=1&limit=4';

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();
      return responseData.data?.clots;
    } catch (error) {
      console.error('Failed to fetch data:', error);
      return [];
    }
  };
  const data: IProduct[] = await fetchData();
  return (
    <main className="w-full flex flex-col gap-2 p-1 md:p-4">
      {data && data.length > 0 && data.map((i: IProduct, idx: number) => <HomePageView product={i} key={(i._id || '') + idx} />)}
    </main>
  );
};
export default Page;
