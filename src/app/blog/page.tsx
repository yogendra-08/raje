'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  User, 
  Clock, 
  ArrowRight,
  BookOpen,
  Shield,
  Crown,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  readTime: string;
  category: string;
  image: string;
  tags: string[];
  featured?: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Legacy of Chhatrapati Shivaji Maharaj: A Visionary Leader',
    excerpt: 'Explore the remarkable life and achievements of Chhatrapati Shivaji Maharaj, the founder of the Maratha Empire, and his enduring impact on Indian history.',
    content: 'Chhatrapati Shivaji Maharaj was not just a warrior king but a visionary leader who established a progressive and inclusive administration...',
    author: 'Dr. Rajesh Patil',
    publishDate: '2024-12-15',
    readTime: '8 min read',
    category: 'History',
    image: '/public/main.jpg',
    tags: ['Shivaji Maharaj', 'Maratha Empire', 'Leadership'],
    featured: true
  },
  {
    id: '2',
    title: 'Traditional Maratha Artistry: The Craft of Paithani Weaving',
    excerpt: 'Discover the intricate art of Paithani weaving, a centuries-old tradition that continues to produce some of India\'s most beautiful textiles.',
    content: 'Paithani weaving is an ancient art form that originated in the town of Paithan in Maharashtra...',
    author: 'Meera Deshpande',
    publishDate: '2024-12-12',
    readTime: '6 min read',
    category: 'Crafts',
    image: '/public/main.jpg',
    tags: ['Paithani', 'Weaving', 'Textiles', 'Traditional Art']
  },
  {
    id: '3',
    title: 'Raigad Fort: The Majestic Capital of the Maratha Empire',
    excerpt: 'Journey to the historic Raigad Fort, the capital of the Maratha Empire, and learn about its strategic importance and architectural marvels.',
    content: 'Perched atop a hill in the Western Ghats, Raigad Fort stands as a testament to Maratha engineering and military prowess...',
    author: 'Prof. Amit Kumar',
    publishDate: '2024-12-10',
    readTime: '10 min read',
    category: 'Architecture',
    image: '/public/main.jpg',
    tags: ['Raigad Fort', 'Architecture', 'Military History']
  },
  {
    id: '4',
    title: 'The Art of Maratha Cuisine: Flavors of Royalty',
    excerpt: 'Explore the rich culinary traditions of the Maratha Empire, from royal feasts to everyday dishes that have stood the test of time.',
    content: 'Maratha cuisine is a reflection of the region\'s diverse cultural influences and agricultural abundance...',
    author: 'Chef Priya Sharma',
    publishDate: '2024-12-08',
    readTime: '7 min read',
    category: 'Cuisine',
    image: '/public/main.jpg',
    tags: ['Maratha Cuisine', 'Traditional Food', 'Royal Recipes']
  },
  {
    id: '5',
    title: 'Maratha Jewelry: Symbols of Power and Beauty',
    excerpt: 'Uncover the significance of traditional Maratha jewelry, from the iconic Kolhapuri Saaj to the royal ornaments that adorned the empire\'s nobility.',
    content: 'Maratha jewelry is not merely decorative but carries deep cultural and symbolic meanings...',
    author: 'Dr. Anjali Joshi',
    publishDate: '2024-12-05',
    readTime: '9 min read',
    category: 'Jewelry',
    image: '/public/main.jpg',
    tags: ['Jewelry', 'Kolhapuri Saaj', 'Royal Ornaments']
  },
  {
    id: '6',
    title: 'The Maratha Navy: Guardians of the Western Coast',
    excerpt: 'Learn about the formidable Maratha Navy that protected the western coast of India and challenged European naval powers.',
    content: 'The Maratha Navy, established by Chhatrapati Shivaji Maharaj, was one of the most powerful naval forces of its time...',
    author: 'Capt. Ramesh Singh',
    publishDate: '2024-12-03',
    readTime: '11 min read',
    category: 'Military',
    image: '/public/main.jpg',
    tags: ['Maratha Navy', 'Naval History', 'Military Strategy']
  }
];

const categories = [
  { name: 'All', count: blogPosts.length },
  { name: 'History', count: blogPosts.filter(p => p.category === 'History').length },
  { name: 'Crafts', count: blogPosts.filter(p => p.category === 'Crafts').length },
  { name: 'Architecture', count: blogPosts.filter(p => p.category === 'Architecture').length },
  { name: 'Cuisine', count: blogPosts.filter(p => p.category === 'Cuisine').length },
  { name: 'Jewelry', count: blogPosts.filter(p => p.category === 'Jewelry').length },
  { name: 'Military', count: blogPosts.filter(p => p.category === 'Military').length }
];

export default function BlogPage() {
  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline text-primary mb-4">
          Maratha Heritage Blog
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover the rich cultural heritage, history, and traditions of the Maratha Empire through our curated articles and stories.
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <Badge
            key={category.name}
            variant="outline"
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {category.name} ({category.count})
          </Badge>
        ))}
      </div>

      {/* Featured Post */}
      {featuredPost && (
        <Card className="mb-12 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-64 lg:h-full">
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary text-primary-foreground">
                  Featured
                </Badge>
              </div>
            </div>
            <CardContent className="p-8 flex flex-col justify-center">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(featuredPost.publishDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {featuredPost.readTime}
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {featuredPost.author}
                </div>
              </div>
              
              <CardTitle className="text-2xl font-headline mb-4">
                {featuredPost.title}
              </CardTitle>
              
              <CardDescription className="text-base mb-6">
                {featuredPost.excerpt}
              </CardDescription>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {featuredPost.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <Link href={`/blog/${featuredPost.id}`}>
                <Button className="w-full sm:w-auto">
                  Read Full Article
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </div>
        </Card>
      )}

      {/* Regular Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {regularPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge variant="secondary">
                  {post.category}
                </Badge>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(post.publishDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </div>
              </div>
              
              <CardTitle className="text-lg font-headline mb-3 line-clamp-2">
                {post.title}
              </CardTitle>
              
              <CardDescription className="mb-4 line-clamp-3">
                {post.excerpt}
              </CardDescription>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <User className="w-3 h-3" />
                  {post.author}
                </div>
                <Link href={`/blog/${post.id}`}>
                  <Button variant="ghost" size="sm">
                    Read More
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Newsletter Signup */}
      <Card className="mt-12 text-center">
        <CardContent className="p-8">
          <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
          <CardTitle className="text-2xl font-headline mb-2">
            Stay Updated with Maratha Heritage
          </CardTitle>
          <CardDescription className="text-lg mb-6">
            Subscribe to our newsletter for the latest articles, cultural insights, and exclusive content about Maratha history and traditions.
          </CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button>
              Subscribe
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 