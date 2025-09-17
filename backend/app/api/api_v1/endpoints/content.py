"""
Content management API endpoints for blog posts and articles
"""

from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, asc
from datetime import datetime, timedelta
import re
import math

from app.api import deps
from app.core.config import settings
from app.models.user import User
from app.models.content import BlogPost, ContentAnalytics, ContentCategory, ContentTag, ContentTemplate, ContentSchedule
from app.schemas.content import (
    BlogPostCreate, BlogPostUpdate, BlogPostResponse, BlogPostListResponse,
    ContentAnalyticsResponse, ContentCategoryCreate, ContentCategoryResponse,
    ContentTagCreate, ContentTagResponse, ContentTemplateCreate, ContentTemplateResponse,
    ContentScheduleCreate, ContentScheduleResponse, ContentDashboardStats,
    SEOScoreResponse, ContentSearchRequest, ContentSearchResponse,
    ContentStatus
)

router = APIRouter()


def calculate_reading_time(content: str) -> int:
    """Calculate reading time in minutes based on word count"""
    words_per_minute = 200
    word_count = len(content.split())
    return max(1, math.ceil(word_count / words_per_minute))


def calculate_word_count(content: str) -> int:
    """Calculate word count of content"""
    return len(content.split())


def generate_slug(title: str) -> str:
    """Generate URL-friendly slug from title"""
    slug = re.sub(r'[^\w\s-]', '', title.lower())
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug.strip('-')


def calculate_seo_score(post: BlogPost) -> SEOScoreResponse:
    """Calculate SEO score and provide recommendations"""
    score = 0
    max_score = 100
    recommendations = []
    issues = []
    
    # Title analysis
    if post.title:
        if 30 <= len(post.title) <= 60:
            score += 20
        else:
            issues.append("Title length should be between 30-60 characters")
            recommendations.append("Optimize title length for better SEO")
    
    # Meta description analysis
    if post.meta_description:
        if 120 <= len(post.meta_description) <= 160:
            score += 20
        else:
            issues.append("Meta description should be between 120-160 characters")
            recommendations.append("Optimize meta description length")
    else:
        issues.append("Missing meta description")
        recommendations.append("Add meta description for better SEO")
    
    # Content length analysis
    if post.content:
        if len(post.content) >= 300:
            score += 20
        else:
            issues.append("Content too short (minimum 300 words recommended)")
            recommendations.append("Expand content for better SEO")
    
    # Featured image analysis
    if post.featured_image:
        score += 10
    else:
        issues.append("Missing featured image")
        recommendations.append("Add featured image for better engagement")
    
    # Category analysis
    if post.category:
        score += 10
    else:
        issues.append("Missing category")
        recommendations.append("Assign a category for better organization")
    
    # Tags analysis
    if post.tags and len(post.tags) > 0:
        score += 10
    else:
        issues.append("Missing tags")
        recommendations.append("Add relevant tags for better discoverability")
    
    # Slug analysis
    if post.slug and '-' in post.slug:
        score += 10
    else:
        issues.append("Slug should contain hyphens for better readability")
        recommendations.append("Optimize slug format")
    
    # Calculate readability score (simplified)
    if post.content:
        sentences = len(re.split(r'[.!?]+', post.content))
        words = len(post.content.split())
        readability_score = 0
        if sentences > 0 and words > 0:
            avg_sentence_length = words / sentences
            if avg_sentence_length <= 20:
                readability_score = 100
            elif avg_sentence_length <= 25:
                readability_score = 80
            elif avg_sentence_length <= 30:
                readability_score = 60
            else:
                readability_score = 40
    else:
        readability_score = 0
    
    return SEOScoreResponse(
        score=score,
        max_score=max_score,
        recommendations=recommendations,
        issues=issues,
        meta_title_length=len(post.title) if post.title else 0,
        meta_description_length=len(post.meta_description) if post.meta_description else 0,
        content_length=len(post.content) if post.content else 0,
        keyword_density={},  # Could be enhanced with keyword analysis
        readability_score=readability_score
    )


@router.post("/posts", response_model=BlogPostResponse)
def create_blog_post(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    post_in: BlogPostCreate,
) -> Any:
    """Create a new blog post"""
    
    # Generate slug if not provided
    if not post_in.slug:
        post_in.slug = generate_slug(post_in.title)
    
    # Check if slug already exists
    existing_post = db.query(BlogPost).filter(BlogPost.slug == post_in.slug).first()
    if existing_post:
        post_in.slug = f"{post_in.slug}-{int(datetime.now().timestamp())}"
    
    # Calculate reading time and word count
    reading_time = calculate_reading_time(post_in.content)
    word_count = calculate_word_count(post_in.content)
    
    # Create blog post
    post = BlogPost(
        **post_in.dict(),
        author_id=current_user.id,
        reading_time=reading_time,
        word_count=word_count,
        published_at=datetime.now() if post_in.status == ContentStatus.PUBLISHED else None
    )
    
    db.add(post)
    db.commit()
    db.refresh(post)
    
    # Calculate SEO score
    seo_score = calculate_seo_score(post)
    post.seo_score = seo_score.score
    db.commit()
    
    # Add author name to response
    post.author_name = current_user.full_name
    
    return post


@router.get("/posts", response_model=BlogPostListResponse)
def list_blog_posts(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    status: Optional[ContentStatus] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
) -> Any:
    """List blog posts with filtering and pagination"""
    
    query = db.query(BlogPost).filter(BlogPost.author_id == current_user.id)
    
    # Apply filters
    if status:
        query = query.filter(BlogPost.status == status)
    if category:
        query = query.filter(BlogPost.category == category)
    if search:
        query = query.filter(
            BlogPost.title.contains(search) | 
            BlogPost.content.contains(search) |
            BlogPost.excerpt.contains(search)
        )
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    offset = (page - 1) * per_page
    posts = query.order_by(desc(BlogPost.created_at)).offset(offset).limit(per_page).all()
    
    # Add author names
    for post in posts:
        post.author_name = current_user.full_name
    
    total_pages = math.ceil(total / per_page)
    
    return BlogPostListResponse(
        posts=posts,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=total_pages
    )


@router.get("/posts/{post_id}", response_model=BlogPostResponse)
def get_blog_post(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    post_id: int,
) -> Any:
    """Get a specific blog post"""
    
    post = db.query(BlogPost).filter(
        BlogPost.id == post_id,
        BlogPost.author_id == current_user.id
    ).first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    post.author_name = current_user.full_name
    return post


@router.put("/posts/{post_id}", response_model=BlogPostResponse)
def update_blog_post(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    post_id: int,
    post_in: BlogPostUpdate,
) -> Any:
    """Update a blog post"""
    
    post = db.query(BlogPost).filter(
        BlogPost.id == post_id,
        BlogPost.author_id == current_user.id
    ).first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    # Update fields
    update_data = post_in.dict(exclude_unset=True)
    
    # Generate slug if title is updated
    if "title" in update_data and not update_data.get("slug"):
        update_data["slug"] = generate_slug(update_data["title"])
    
    # Recalculate reading time and word count if content is updated
    if "content" in update_data:
        update_data["reading_time"] = calculate_reading_time(update_data["content"])
        update_data["word_count"] = calculate_word_count(update_data["content"])
    
    # Update published_at if status changes to published
    if update_data.get("status") == ContentStatus.PUBLISHED and not post.published_at:
        update_data["published_at"] = datetime.now()
    
    for field, value in update_data.items():
        setattr(post, field, value)
    
    db.commit()
    db.refresh(post)
    
    # Recalculate SEO score
    seo_score = calculate_seo_score(post)
    post.seo_score = seo_score.score
    db.commit()
    
    post.author_name = current_user.full_name
    return post


@router.delete("/posts/{post_id}")
def delete_blog_post(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    post_id: int,
) -> Any:
    """Delete a blog post"""
    
    post = db.query(BlogPost).filter(
        BlogPost.id == post_id,
        BlogPost.author_id == current_user.id
    ).first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    db.delete(post)
    db.commit()
    
    return {"message": "Blog post deleted successfully"}


@router.get("/posts/{post_id}/seo", response_model=SEOScoreResponse)
def get_seo_score(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    post_id: int,
) -> Any:
    """Get SEO score and recommendations for a blog post"""
    
    post = db.query(BlogPost).filter(
        BlogPost.id == post_id,
        BlogPost.author_id == current_user.id
    ).first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    return calculate_seo_score(post)


@router.get("/dashboard/stats", response_model=ContentDashboardStats)
def get_dashboard_stats(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """Get content dashboard statistics"""
    
    # Basic stats
    total_posts = db.query(BlogPost).filter(BlogPost.author_id == current_user.id).count()
    published_posts = db.query(BlogPost).filter(
        BlogPost.author_id == current_user.id,
        BlogPost.status == ContentStatus.PUBLISHED
    ).count()
    draft_posts = db.query(BlogPost).filter(
        BlogPost.author_id == current_user.id,
        BlogPost.status == ContentStatus.DRAFT
    ).count()
    
    # Analytics stats
    analytics = db.query(ContentAnalytics).join(BlogPost).filter(
        BlogPost.author_id == current_user.id
    ).all()
    
    total_views = sum(a.page_views for a in analytics)
    total_shares = sum(a.social_shares for a in analytics)
    avg_reading_time = sum(a.avg_time_on_page for a in analytics) / len(analytics) if analytics else 0
    
    # Top categories
    top_categories = db.query(
        BlogPost.category,
        func.count(BlogPost.id).label('count')
    ).filter(
        BlogPost.author_id == current_user.id,
        BlogPost.category.isnot(None)
    ).group_by(BlogPost.category).order_by(desc('count')).limit(5).all()
    
    # Top tags
    top_tags = db.query(
        func.json_extract(BlogPost.tags, '$').label('tag'),
        func.count(BlogPost.id).label('count')
    ).filter(
        BlogPost.author_id == current_user.id,
        BlogPost.tags.isnot(None)
    ).group_by('tag').order_by(desc('count')).limit(10).all()
    
    # Recent posts
    recent_posts = db.query(BlogPost).filter(
        BlogPost.author_id == current_user.id
    ).order_by(desc(BlogPost.created_at)).limit(5).all()
    
    for post in recent_posts:
        post.author_name = current_user.full_name
    
    return ContentDashboardStats(
        total_posts=total_posts,
        published_posts=published_posts,
        draft_posts=draft_posts,
        total_views=total_views,
        total_shares=total_shares,
        avg_reading_time=avg_reading_time,
        top_categories=[{"name": cat[0], "count": cat[1]} for cat in top_categories],
        top_tags=[{"name": tag[0], "count": tag[1]} for tag in top_tags],
        recent_posts=recent_posts,
        performance_metrics={
            "avg_seo_score": db.query(func.avg(BlogPost.seo_score)).filter(
                BlogPost.author_id == current_user.id
            ).scalar() or 0,
            "total_word_count": db.query(func.sum(BlogPost.word_count)).filter(
                BlogPost.author_id == current_user.id
            ).scalar() or 0
        }
    )


@router.post("/posts/{post_id}/publish")
def publish_blog_post(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    post_id: int,
) -> Any:
    """Publish a blog post"""
    
    post = db.query(BlogPost).filter(
        BlogPost.id == post_id,
        BlogPost.author_id == current_user.id
    ).first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    post.status = ContentStatus.PUBLISHED
    post.published_at = datetime.now()
    
    db.commit()
    
    return {"message": "Blog post published successfully"}


@router.post("/posts/{post_id}/unpublish")
def unpublish_blog_post(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    post_id: int,
) -> Any:
    """Unpublish a blog post"""
    
    post = db.query(BlogPost).filter(
        BlogPost.id == post_id,
        BlogPost.author_id == current_user.id
    ).first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    post.status = ContentStatus.DRAFT
    post.published_at = None
    
    db.commit()
    
    return {"message": "Blog post unpublished successfully"}
