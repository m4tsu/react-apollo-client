import React, { FC, FormEvent, useState, ChangeEvent } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import { client } from "../index";
import { GET_USER_WITH_POSTS } from "../App";

const GET_POSTS = gql`
  query getPosts {
    posts {
      id
      user {
        id
      }
      title
      body
    }
  }
`;

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
  const { loading, error, data } = useQuery(GET_POSTS);
  const [updatePost] = useMutation(UPDATE_POST);
  // console.log(data);

  const [addPost] = useMutation(ADD_POST, {
    update(cache, { data: { createPost } }) {
      const { posts } = cache.readQuery({ query: GET_POSTS });
      console.log(createPost.post);
      console.log(posts);
      cache.writeQuery({
        query: GET_POSTS,
        data: { posts: posts.concat([createPost.post]) }
      });
    }
  });

  console.log(values);
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
