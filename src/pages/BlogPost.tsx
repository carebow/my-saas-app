
'use client'

import React from "react";

export const dynamic = 'force-dynamic';
import SEO from "../components/SEO";
import Navbar from "../components/UnifiedNavigation";
import Footer from "../components/UnifiedFooter";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, User, ArrowLeft, Share2, BookmarkPlus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { blogPosts } from "../data/blogPosts";

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-20 py-20 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <Link to="/blog">
            <Button>← Back to Blog</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-20">
        <article className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link to="/blog">
              <Button variant="outline" className="mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </motion.div>

          {/* Article Header */}
          <motion.header
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 mb-12"
          >
            <div className="space-y-4">
              <span className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {post.category}
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {post.title}
              </h1>
              <p className="text-xl text-gray-600">
                {post.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-b border-gray-200 py-6">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {post.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {post.date}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {post.readTime}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </motion.header>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-96 object-cover rounded-xl mb-8"
            />
            
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Experience CareBow?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of families already transforming their healthcare experience with CareBow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                Join Waitlist
              </Button>
              <Button size="lg" variant="outline">
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
