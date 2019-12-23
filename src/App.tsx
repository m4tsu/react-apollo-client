import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import PostNew from "./components/PostNew";

export const GET_USER_WITH_POSTS = gql`
  query {
    users {
      id
      name
      posts {
        id
        title
        body
      }
    }
  }
`;

const App: React.FC = () => {
  const { loading, error, data } = useQuery(GET_USER_WITH_POSTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;
  return (
    <>
      <PostNew />
      {data.users.map(user => {
        return (
          <div key={user.id}>
            --- user ---
            <div>
              UserID: {user.id}, Name: {user.name}
            </div>
            {user.posts.map(post => {
              return (
                <div key={post.id}>
                  PostID: {post.id}, Title: {post.title}, Body: {post.body}
                </div>
              );
            })}
            --- user ---
          </div>
        );
      })}
    </>
  );
};

export default App;
