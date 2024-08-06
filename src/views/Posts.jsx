import React, { useContext, useState, useEffect } from "react";
import { Context } from "../js/store/appContext";
import { useNavigate } from "react-router";

const Posts = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [posts, setPosts] = useState(null);

  const handleLike = async (postId) => {
    const response = await actions.likePost(postId);
    if (response) {
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: response.likes,
                liked_by_me: response.liked_by_me,
              }
            : post
        )
      );
    }
  };

  useEffect(() => {
    const getData = async () => {
      const response = await actions.getPosts();
      if (response) {
        setPosts(response);
      }
    };
    getData();
  }, [actions]);

  return (
    <>
      {posts &&
        posts.map((post, index) => {
          return (
            <div
              className="card"
              style={{
                width: "18rem",
                border: "none",
                borderRadius: "15px",
                overflow: "hidden",
              }}
              key={index}
            >
              <div
                className="card-header d-flex align-items-center"
                style={{
                  padding: "0.5rem 1rem",
                  borderBottom: "1px solid #e6e6e6",
                }}
              >
                <img
                  src={`https://random.imagecdn.app/v1/image?width=500&height=150`}
                  className="rounded-circle"
                  alt="Profile"
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "cover",
                    marginRight: "10px",
                  }}
                />
                <h6
                  className="mb-0"
                  style={{ fontSize: "14px", fontWeight: "bold" }}
                >
                  {post.author.username}
                </h6>
              </div>

              <img
                src={
                  post.image
                    ? post.image
                    : "https://random.imagecdn.app/v1/image?width=500&height=150"
                }
                className="card-img-top"
                alt="Post Image"
                style={{ width: "100%", height: "auto" }}
              />

              <div className="card-body" style={{ padding: "1rem" }}>
                <div className="d-flex align-items-center mb-2">
                  <button
                    type="button"
                    className="btn btn-light btn-sm"
                    style={{
                      border: "none",
                      background: "none",
                      color: post.liked_by_me ? "red" : "black",
                    }}
                    onClick={() => handleLike(post.id)}
                  >
                    <i
                      className={
                        post.liked_by_me
                          ? "fa-solid fa-heart"
                          : "fa-regular fa-heart"
                      }
                    ></i>{" "}
                    {post.likes?.length || 0}
                  </button>
                </div>

                <p
                  className="card-text"
                  style={{ fontSize: "14px", marginBottom: "0.5rem" }}
                >
                  <strong>{post.author.username}</strong> {post.message}
                </p>

                <p
                  className="card-text"
                  style={{ fontSize: "12px", color: "#999" }}
                >
                  Posted on <span>{post.created_at}</span>
                </p>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default Posts;
