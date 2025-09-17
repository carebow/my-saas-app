"""
Content management schemas for blog posts and articles
"""

from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, validator
from enum import Enum


class ContentStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class BlogPostBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    slug: str = Field(..., min_length=1, max_length=255)
    excerpt: Optional[str] = None
    content: str = Field(..., min_length=1)
    
    # SEO fields
    meta_title: Optional[str] = Field(None, max_length=255)
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = Field(None, max_length=500)
    canonical_url: Optional[str] = Field(None, max_length=500)
    
    # Content status
    status: ContentStatus = ContentStatus.DRAFT
    featured: bool = False
    featured_image: Optional[str] = Field(None, max_length=500)
    
    # Content categorization
    category: Optional[str] = Field(None, max_length=100)
    tags: List[str] = []
    
    # Social sharing
    social_title: Optional[str] = Field(None, max_length=255)
    social_description: Optional[str] = None
    social_image: Optional[str] = Field(None, max_length=500)


class BlogPostCreate(BlogPostBase):
    pass


class BlogPostUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    slug: Optional[str] = Field(None, min_length=1, max_length=255)
    excerpt: Optional[str] = None
    content: Optional[str] = None
    
    # SEO fields
    meta_title: Optional[str] = Field(None, max_length=255)
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = Field(None, max_length=500)
    canonical_url: Optional[str] = Field(None, max_length=500)
    
    # Content status
    status: Optional[ContentStatus] = None
    featured: Optional[bool] = None
    featured_image: Optional[str] = Field(None, max_length=500)
    
    # Content categorization
    category: Optional[str] = Field(None, max_length=100)
    tags: Optional[List[str]] = None
    
    # Social sharing
    social_title: Optional[str] = Field(None, max_length=255)
    social_description: Optional[str] = None
    social_image: Optional[str] = Field(None, max_length=500)


class BlogPostResponse(BlogPostBase):
    id: int
    author_id: int
    published_at: Optional[datetime]
    updated_at: Optional[datetime]
    created_at: datetime
    
    # SEO and analytics
    seo_score: float
    reading_time: int
    word_count: int
    
    # Author info
    author_name: Optional[str] = None
    
    class Config:
        from_attributes = True


class ContentAnalyticsBase(BaseModel):
    page_views: int = 0
    unique_visitors: int = 0
    bounce_rate: float = 0.0
    avg_time_on_page: float = 0.0
    social_shares: int = 0
    comments_count: int = 0
    likes_count: int = 0
    organic_traffic: int = 0
    keyword_rankings: Dict[str, int] = {}
    backlinks_count: int = 0
    newsletter_signups: int = 0
    contact_form_submissions: int = 0


class ContentAnalyticsResponse(ContentAnalyticsBase):
    id: int
    blog_post_id: int
    recorded_at: datetime
    
    class Config:
        from_attributes = True


class ContentCategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    slug: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    color: Optional[str] = Field(None, pattern=r'^#[0-9A-Fa-f]{6}$')
    icon: Optional[str] = Field(None, max_length=50)
    meta_title: Optional[str] = Field(None, max_length=255)
    meta_description: Optional[str] = None
    active: bool = True


class ContentCategoryCreate(ContentCategoryBase):
    pass


class ContentCategoryResponse(ContentCategoryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class ContentTagBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    slug: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = None
    color: Optional[str] = Field(None, pattern=r'^#[0-9A-Fa-f]{6}$')


class ContentTagCreate(ContentTagBase):
    pass


class ContentTagResponse(ContentTagBase):
    id: int
    usage_count: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class ContentTemplateBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    title_template: Optional[str] = Field(None, max_length=255)
    content_template: Optional[str] = None
    meta_template: Optional[Dict[str, Any]] = None
    category: Optional[str] = Field(None, max_length=100)
    tags: List[str] = []
    featured: bool = False


class ContentTemplateCreate(ContentTemplateBase):
    pass


class ContentTemplateResponse(ContentTemplateBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class ContentScheduleBase(BaseModel):
    blog_post_id: int
    scheduled_at: datetime
    social_platforms: List[str] = []
    social_messages: Dict[str, str] = {}


class ContentScheduleCreate(ContentScheduleBase):
    pass


class ContentScheduleResponse(ContentScheduleBase):
    id: int
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class BlogPostListResponse(BaseModel):
    posts: List[BlogPostResponse]
    total: int
    page: int
    per_page: int
    total_pages: int


class ContentDashboardStats(BaseModel):
    total_posts: int
    published_posts: int
    draft_posts: int
    total_views: int
    total_shares: int
    avg_reading_time: float
    top_categories: List[Dict[str, Any]]
    top_tags: List[Dict[str, Any]]
    recent_posts: List[BlogPostResponse]
    performance_metrics: Dict[str, Any]


class SEOScoreResponse(BaseModel):
    score: float
    max_score: float
    recommendations: List[str]
    issues: List[str]
    meta_title_length: int
    meta_description_length: int
    content_length: int
    keyword_density: Dict[str, float]
    readability_score: float


class ContentSearchRequest(BaseModel):
    query: str
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    status: Optional[ContentStatus] = None
    author_id: Optional[int] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    page: int = 1
    per_page: int = 10


class ContentSearchResponse(BaseModel):
    results: List[BlogPostResponse]
    total: int
    page: int
    per_page: int
    total_pages: int
    facets: Dict[str, List[Dict[str, Any]]]
