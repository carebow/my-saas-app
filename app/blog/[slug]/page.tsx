import dynamic from 'next/dynamic'

const BlogPost = dynamic(() => import('../../../src/pages/BlogPost'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-muted border-t-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading page...</p>
      </div>
    </div>
  ),
})

export async function generateStaticParams() {
  return [
    { slug: 'example' },
  ]
}

export default function BlogPostPage() {
  return <BlogPost />
}