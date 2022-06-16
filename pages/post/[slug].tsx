import { GetStaticProps } from "next";
import { Params } from "next-sanity/dist/useSubscription";
import Header from "../../Components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";
import { useForm, SubmitHandler } from "react-hook-form";
import PortableText from "react-portable-text";
import { useState } from "react";
interface props {
  post: Post;
}
interface iFormInout {
  name: string;
  email: string;
  comment: string;
  _id: string;
}

function Post({ post }: props) {
  const [submit, setSubmit] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<iFormInout>();
  const Submit: SubmitHandler<iFormInout> = async (data) => {
    setSubmit(false);
    await fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    }).then(() => setSubmit(true));
  };
  console.log(post);

  return (
    <main>
      <Header />
      <img
        className="w-full h-40 object-cover"
        src={urlFor(post.mainImage).url()!}
      />
      <article className="max-w-3xl mx-auto p-5 ">
        <h1 className="text-4xl mt-10 mb-3 ">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500">{post.description}</h2>
        <div className="flex items-center">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()!}
          />
          <p className="font-extralight text-sm">
            Blog post by{" "}
            <span className="text-green-600">{post.author.name}</span> -
            Published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>
        <div className="mt-10">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
          />
        </div>
      </article>

      <hr className="max-w-lg  my-5 mx-auto border-orange-500" />
      {submit ? (
        <div className="flex flex-col bg-yellow-500  py-10 my-10 text-white max-w-3xl mx-auto ">
          <h1 className="text-3xl font-bold mx-auto ">
            Thanks For your Comments,
          </h1>
          <p className="mx-auto text-black mt-5 ">
            ONCE THE COMMENT IS APPROVED IT WILL BE DISPLAYED BELOW
          </p>
        </div>
      ) : (
        <form
          className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
          onSubmit={handleSubmit(Submit)}
        >
          <h3 className="text-sm text-orange-500">Enjoyed this article?</h3>
          <h4 className="text-3xl font-bold">Leave a Comment below!</h4>
          <hr className="py-3 mt-2" />
          <input
            value={post._id}
            {...register("_id")}
            type="hidden"
            name="_id"
          />
          <label className="block mb-5">
            <span className="text-gray-700">Name</span>
            <input
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 ring"
              placeholder="john Apple seed"
              {...register("name", { required: "true" })}
              type="text"
            />
          </label>
          <label className="block mb-5">
            <span className="text-gray-700">E-mail</span>
            <input
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 ring"
              placeholder="john Apple seed"
              type="text"
              {...register("email", { required: "true" })}
            />
          </label>
          <label className="block mb-5">
            <span className="text-gray-700">Comment</span>
            <textarea
              className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 ring"
              placeholder="john Apple seed"
              {...register("comment", { required: "true" })}
              rows={8}
            />
          </label>
          <div className="flex flex-col">
            {errors.name && (
              <span className="text-red-500">- Name feild is required</span>
            )}
            {errors.email && (
              <span className="text-red-500">- E-mail feild is required</span>
            )}
            {errors.comment && (
              <span className="text-red-500">- Comment feild is required</span>
            )}
          </div>
          <input
            type="submit"
            className="shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer"
          />
        </form>
      )}
      <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow shadow-yellow-500 space-y-2">
        <h3 className="text-4xl">COMMENTS</h3>
        <hr className="pb-2"/>
        {post.comment.map((c) => (
          <div key={c._id}>
            <p>
              <span className="text-yellow-500">{c.name}</span>:{" "}{c.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Post;
export const getStaticPaths = async () => {
  const querry = `*[_type=="post"]{
        _id,
        slug {
      current
      }
      
      }`;
  const posts = await sanityClient.fetch(querry);
  const paths = posts.map((p: Post) => ({
    params: {
      slug: p.slug.current,
    },
  }));
  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const querry = `*[_type=="post" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    _createdAt,
    mainImage,
    body,
    description,
    author -> {
  name,image
  },
'comment':*[_type=="comment" && post._ref ==^._id && approved == true],
   


  }
      `;

  const post = await sanityClient.fetch(querry, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};
