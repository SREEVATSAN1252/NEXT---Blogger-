// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import SanityClient from "@sanity/client";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,

  token: process.env.SANITY_API_TOKEN,
};
const client = SanityClient(config);
export default async function commentSubmit(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { _id, name, email, comment } = JSON.parse(req.body);
  try {
    await client.create({
      _type: "comment",
      post: {
        _type: "reference",
        _ref: _id,
      },
      name,
      email,
      comment,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "could not submit the message", err });
  }
  console.log("comment submitted succesfully");

  return res.status(200).json({ message: "comment submitted" });
}
