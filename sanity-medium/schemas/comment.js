export default {
  name: "comment",
  title: "Comment",
  type: "document",
  fields: [
    {
      name: "name",
      type: "string",
    },
    {
      name: "email",
      type: "string",
    },
    {
      name: "comment",
      type: "string",
    },
    {
        title:"Approved",
        name:"approved",
        type:"boolean",
        description:"comment wont get showed up without Approval"

    },
    {
        name:"post",
        type:"reference",
        to:[{type:"post"}],
    }
  ],
};
