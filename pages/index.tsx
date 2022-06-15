import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Header from "../Components/Header";
import { sanityClient, urlFor} from "../sanity";
import { Post } from "../typings";
interface Props {
  posts: [Post];
}
export default function Home({ posts }: Props) {
  console.log("posts", posts);
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Blogger</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="flex justify-between items-center bg-orange-400">
        <div className="px-10 space-y-5 ">
          <h1 className="text-6xl max-w-xl font-serif">
            <span className="underline decoration-4">Blogger</span> is a Place
            to read , write and connect
          </h1>
          <h2>
            it's easy and free to post your thinking on any topic and connect
            with millions of user
          </h2>
        </div>
        <img
          className="hidden md:inline-flex h-32 lg:h-60"
          src="https://cdn-icons-png.flaticon.com/512/124/124022.png"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6">
        {
          posts.map((p)=>(
            <Link key={p._id} href={`/post/${p.slug.current}`}>
              <div className="group cursor-pointer border rounded-lg overflow-hidden">
                <img className="h-60 w-full group-hover:scale-105 transition-transform duration-200 ease-in-out" src={urlFor(p.mainImage).url()!}/>
              
              <div className="flex justify-between p-5 bg-white">
                <div>
                <p className="text-lg font-bold"> {p.title}</p>
                <p className="text-xs">{p.description} by {p.author.name}</p>
              </div>
              <img className=" h-12 w-12 rounded-full"  src={urlFor(p.author.image).url()}/>
              </div>
              </div>
            </Link>
          ))
        }
      </div>
    </div>
  );
}

export const getServerSideProps = async () => {
  const querry = `*[_type=="post"]{
  _id,
  title,
  slug,
  mainImage,
  description,
  author -> {
name,image
}
}`;
  const posts = await sanityClient.fetch(querry);
  return {
    props: {
      posts,
    },
  };
};
