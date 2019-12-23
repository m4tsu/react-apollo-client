import React, { FC, FormEvent, useState, ChangeEvent } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import { client } from "../index";
import { GET_USER_WITH_POSTS } from "../App";

const ADD_POST = gql`
  mutation createPost($userId: Int!, $title: String!, $body: String!) {
    createPost(input: { userId: $userId, title: $title, body: $body }) {
      post {
        id
        user {
          id
        }
        title
        body
      }
    }
  }
`;

const UPDATE_POST = gql`
  mutation updatePost($id: Int!, $title: String!, $body: String!) {
    updatePost(input: { id: $id, title: $title, body: $body }) {
      post {
        id
        user {
          id
        }
        title
        body
      }
    }
  }
`;

const PostNew: FC = () => {
  const [values, setValues] = useState({ userId: "", title: "", body: "" });
  const [updatePost] = useMutation(UPDATE_POST);
  const [addPost, { data }] = useMutation(ADD_POST, {
    update(cache, { data: { createPost } }) {
      // const post = client.readFragment({
      //   id: "Post_1",
      //   fragment: gql`
      //     fragment post on Post {
      //       id
      //       title
      //       body
      //     }
      //   `
      // });
      // console.log(post);
      // const post = createPost.post;
      // console.log(post);
      // client.writeFragment({
      //   id: post.id,
      //   fragment: gql`
      //     fragment newPost on Post {
      //       id
      //       title
      //       body
      //     }
      //   `,
      //   data: {
      //     id: post.id,
      //     title: post.title,
      //     body: post.body,
      //     __typename: "Post"
      //   }
      // });
    }
  });

  console.log(values);
  console.log(data);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addPost({
      variables: {
        userId: Number(values.userId),
        title: values.title,
        body: values.body
      }
    });
    setValues({ userId: "", title: "", body: "" });
  };

  const handleSubmitUpdate = (e: FormEvent) => {
    e.preventDefault();
    updatePost({
      variables: {
        id: Number(values.userId),
        title: values.title,
        body: values.body
      }
    });
    setValues({ userId: "", title: "", body: "" });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  return (
    <div>
      Post Form
      <form onSubmit={handleSubmit}>
        <label htmlFor="">
          UserId or PostId
          <input
            type="number"
            name="userId"
            value={values.userId}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="">
          Title
          <input
            type="text"
            name="title"
            value={values.title}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="">
          Body
          <input
            type="text"
            name="body"
            value={values.body}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Add Post</button>
        <button onClick={handleSubmitUpdate}>Update Post</button>
      </form>
    </div>
  );
};

export default PostNew;
