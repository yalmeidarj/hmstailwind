import styles from './page.module.css'
import Link from 'next/link';
// import { prisma } from './lib/prisma'
import { auth } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode } from 'react';


async function getData() {
  // const prisma = new PrismaClient();
  // const location = await prisma.location.findMany({
  //   include: {
  //     Street: true,
  //   },
  // });
  // await prisma.$disconnect();
  // return location;

  // Use the fetch API to get the data from the API..
  try {
    const res = await fetch('https://hmsapi.herokuapp.com/locations');
    const location = await res.json();
    return location;
  }
  catch (error) {
    console.error('Error retrieving the locations:', error);
    return [];
  }
}

async function getNumberOfStreets(locationId: any) {
  // Use prisma.
  // try {
  //   // use Prisma to get the data from the database
  //   const streets = await prisma.street.findMany({
  //     where: {
  //       locationId: locationId,
  //     },
  //   });
  //   return streets.length;
  // }
  // catch (error) {
  //   console.error('Error retrieving the streets:', error);
  //   return [];
  // }

  // Use the fetch API to get the data from the API..
  try {
    const res = await fetch(`https://hmsapi.herokuapp.com/streets/${locationId}`);
    const streets = await res.json();
    return streets.length;
  }
  catch (error) {
    console.error('Error retrieving the streets:', error);
    return [];
  }

}

// const res = await fetch('http://localhost:9000/locations');
// // The return value is *not* serialized
// // You can return Date, Map, Set, etc.

// // Recommendation: handle errors
// if (!res.ok) {
//   // This will activate the closest `error.js` Error Boundary
//   throw new Error('Failed to fetch data');
// }

// return res.json();
// }

export default async function Home() {


  // if (!session) {
  //   redirect("/api/auth/signin");
  // }
  const user = await currentUser();
  const data = await getData();

  return (
    <main className="flex flex-col items-center justify-center space-y-4">

      <h1 className="font-bold text-2xl mb-4">Locations</h1>
      <ul className="grid grid-cols-3 gap-4">
        {data.map((location: { id: Key | null | undefined; priorityStatus: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; neighborhood: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; }) => (
          <div className="flex flex-row justify-center  items-center my-4" key={location.id}>
            <li className="flex flex-col p-4 border border-gray-200 rounded text-center cursor-pointer bg-gray-500 text-white">
              <Link href={`/locations/${location.id}`}>
                <div className="flex flex-col items-center justify-center border border-gray-200 px-2 py-1">
                  <p className="text-sm text-teal-400 my-1">Priority</p>
                  <span className="text-sm text-teal-400 my-1">
                    {location.priorityStatus}
                  </span>
                </div>
                <div className="mt-4">

                  {location.name}
                  <p>{location.neighborhood}</p>

                  <div className="flex flex-row justify-center items-center text-gray-700">
                    <p className="text-sm text-teal-400 mx-2">Streets: {getNumberOfStreets(location.id)}</p>
                    <span className="text-sm text-teal-400 mx-2">Current workers: Yuri</span>
                  </div>
                </div>
              </Link>
            </li>
          </div>
        ))}
      </ul>
    </main>

  );
}
