export interface Post {
  _id: string;
  name: string;
  email: string;
  
  _createdAt: string;
  title: string;
  author: {
    name: string;
    image: string;
  };
  comment: [Comment];
  description: string;
  mainImage: {
    asset: {
      url: string;
    };
  };
  slug: {
    current: string;
  };
  body: [object];
}

export interface Comment {
  approved: boolean;
  name: string;
  email: string;
  comment: string;
  post: {
    _ref: string;
    _type: string;
  };
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
}
