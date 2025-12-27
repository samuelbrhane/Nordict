"use client";

import { useState } from "react";
import {
  BlogGrid,
  BlogHero,
  BlogNewsletter,
} from "@/components/sections/resources/blog";

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <div>
      <BlogHero
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <BlogGrid activeCategory={activeCategory} />
      <BlogNewsletter />
    </div>
  );
};

export default Blog;
