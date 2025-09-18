export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-6xl mx-auto p-6 space-y-12">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="h-10 w-10 text-red-500">❤️</div>
            <h1 className="text-5xl font-bold text-gray-900">About CareBow</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            We're revolutionizing healthcare by combining the wisdom of traditional medicine with cutting-edge AI technology, 
            making quality healthcare accessible to everyone, everywhere.
          </p>
        </div>
        
        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="border border-blue-200 bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Our Mission</h2>
            <p className="text-blue-700">
              To democratize healthcare by providing AI-powered, culturally-sensitive health solutions that combine 
              the best of modern medicine with traditional healing wisdom, making quality healthcare accessible, 
              affordable, and personalized for everyone.
            </p>
          </div>
          
          <div className="border border-green-200 bg-green-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-green-800 mb-4">Our Vision</h2>
            <p className="text-green-700">
              A world where every person has access to intelligent, compassionate healthcare that understands their 
              unique needs, cultural background, and personal health journey, empowering them to live healthier, 
              more fulfilling lives.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
