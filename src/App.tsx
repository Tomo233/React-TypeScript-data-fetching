import { type ReactNode, useEffect, useState } from "react";
import BlogPosts, { BlogPost } from "./components/BlogPosts";
import { get } from "./util/http";
import fetchingImg from "../src/assets/data-fetching.png";
import ErrorMessage from "./components/ErrorMessage";

type RawDataBlogPost = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

function App() {
  const [fetchedPosts, setFetchedPosts] = useState<BlogPost[]>();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    setIsFetching(true);
    async function fetchPosts() {
      try {
        const data = (await get(
          "https://jsonplaceholder.typicode.com/posts"
        )) as RawDataBlogPost[];

        const blogPosts: BlogPost[] = data.map((rawPost) => {
          return {
            id: rawPost.id,
            title: rawPost.title,
            text: rawPost.body,
          };
        });
        setFetchedPosts(blogPosts);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
        // setError("Failed to fetch posts!");
      }
      setIsFetching(false);
    }
    fetchPosts();
  }, []);

  let content: ReactNode;

  if (error) content = <ErrorMessage text={error} />;

  if (fetchedPosts) content = <BlogPosts posts={fetchedPosts} />;

  if (isFetching) content = <p id="loading-fallback">Fetching posts...</p>;

  return (
    <main>
      <img
        src={fetchingImg}
        alt="An abstract image dipicting a data fetching process"
      />
      {content}
    </main>
  );
}

export default App;
