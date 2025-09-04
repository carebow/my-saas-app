
import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import Navbar from "../components/UnifiedNavigation";
import Footer from "../components/UnifiedFooter";
import { blogPosts } from "../data/blogPosts";

const Blog = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "CareBow Healthcare Blog",
    "description": "Expert insights, latest trends, and practical tips for revolutionizing healthcare at home. Stay informed about the future of personalized medical care.",
    "url": "https://www.carebow.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "CareBow"
    },
    "blogPost": blogPosts.filter(post => !post.comingSoon).map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "url": `https://www.carebow.com/blog/${post.slug}`,
      "datePublished": post.date,
      "author": {
        "@type": "Person",
        "name": post.author
      }
    }))
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Healthcare Blog | CareBow Expert Insights & Tips"
        description="Stay informed with CareBow's healthcare blog. Get expert insights on in-home care, AI healthcare technology, elder care tips, pediatric health, and the latest trends in personalized medical care."
        keywords="healthcare blog, in-home care tips, AI healthcare insights, elder care advice, pediatric health, healthcare technology trends, medical care tips, home healthcare guide, health and wellness blog, healthcare innovation news"
        url="https://www.carebow.com/blog"
        structuredData={structuredData}
      />
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-8"
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900">
                CareBow 
                <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Healthcare Blog
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Expert insights, latest trends, and practical tips for revolutionizing healthcare at home. 
                Stay informed about the future of personalized medical care.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
              {blogPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className={`h-full bg-white border border-slate-200 hover:shadow-xl transition-all duration-300 ${post.comingSoon ? 'opacity-75' : 'hover:-translate-y-2'}`}>
                    <CardHeader className="p-0">
                      <div className="relative">
                        <img 
                          src={post.image} 
                          alt={`${post.title} - Healthcare blog post`}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-full">
                            {post.category}
                          </span>
                        </div>
                        {post.comingSoon && (
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 bg-slate-600 text-white text-sm font-medium rounded-full">
                              Coming Soon
                            </span>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4 bg-white">
                      <h2 className="text-xl font-bold text-gray-900 line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {post.author}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {post.readTime}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {post.date}
                        </div>
                      </div>
                      
                      {!post.comingSoon ? (
                        <Button 
                          asChild 
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                        >
                          <Link to={`/blog/${post.slug}`} className="flex items-center justify-center">
                            Read More
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      ) : (
                        <Button disabled className="w-full bg-slate-400 text-white">
                          Available Soon
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
