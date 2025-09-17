"""
Content management models for blog posts and articles
"""

from sqlalchemy import Column, Integer, String, DateTime, Text, JSON, Boolean, ForeignKey, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class BlogPost(Base):
    """Blog post model for content management"""
    __tablename__ = "blog_posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    excerpt = Column(Text)
    content = Column(Text, nullable=False)
    
    # SEO fields
    meta_title = Column(String(255))
    meta_description = Column(Text)
    meta_keywords = Column(String(500))
    canonical_url = Column(String(500))
    
    # Content status
    status = Column(String(20), default="draft")  # draft, published, archived
    featured = Column(Boolean, default=False)
    featured_image = Column(String(500))
    
    # Author and publishing
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    published_at = Column(DateTime(timezone=True))
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Content categorization
    category = Column(String(100))
    tags = Column(JSON)  # Array of tag strings
    
    # SEO and analytics
    seo_score = Column(Float, default=0.0)
    reading_time = Column(Integer, default=0)  # in minutes
    word_count = Column(Integer, default=0)
    
    # Social sharing
    social_title = Column(String(255))
    social_description = Column(Text)
    social_image = Column(String(500))
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    author = relationship("User", back_populates="blog_posts")
    analytics = relationship("ContentAnalytics", back_populates="blog_post", cascade="all, delete-orphan")


class ContentAnalytics(Base):
    """Analytics data for content performance"""
    __tablename__ = "content_analytics"

    id = Column(Integer, primary_key=True, index=True)
    blog_post_id = Column(Integer, ForeignKey("blog_posts.id"), nullable=False)
    
    # Traffic metrics
    page_views = Column(Integer, default=0)
    unique_visitors = Column(Integer, default=0)
    bounce_rate = Column(Float, default=0.0)
    avg_time_on_page = Column(Float, default=0.0)
    
    # Engagement metrics
    social_shares = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    likes_count = Column(Integer, default=0)
    
    # SEO metrics
    organic_traffic = Column(Integer, default=0)
    keyword_rankings = Column(JSON)  # {keyword: ranking}
    backlinks_count = Column(Integer, default=0)
    
    # Conversion metrics
    newsletter_signups = Column(Integer, default=0)
    contact_form_submissions = Column(Integer, default=0)
    
    # Timestamps
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    blog_post = relationship("BlogPost", back_populates="analytics")


class ContentCategory(Base):
    """Content categories for organization"""
    __tablename__ = "content_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    color = Column(String(7))  # Hex color code
    icon = Column(String(50))
    
    # SEO
    meta_title = Column(String(255))
    meta_description = Column(Text)
    
    # Status
    active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class ContentTag(Base):
    """Content tags for better organization"""
    __tablename__ = "content_tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    slug = Column(String(50), unique=True, nullable=False)
    description = Column(Text)
    color = Column(String(7))  # Hex color code
    
    # Usage tracking
    usage_count = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class ContentTemplate(Base):
    """Templates for consistent content creation"""
    __tablename__ = "content_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    
    # Template content
    title_template = Column(String(255))
    content_template = Column(Text)
    meta_template = Column(JSON)  # Template for meta fields
    
    # Template settings
    category = Column(String(100))
    tags = Column(JSON)
    featured = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class ContentSchedule(Base):
    """Content scheduling for publishing"""
    __tablename__ = "content_schedule"

    id = Column(Integer, primary_key=True, index=True)
    blog_post_id = Column(Integer, ForeignKey("blog_posts.id"), nullable=False)
    
    # Scheduling
    scheduled_at = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(20), default="scheduled")  # scheduled, published, cancelled
    
    # Social media scheduling
    social_platforms = Column(JSON)  # Array of platforms
    social_messages = Column(JSON)  # Platform-specific messages
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    blog_post = relationship("BlogPost")
