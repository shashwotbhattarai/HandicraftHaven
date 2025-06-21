import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigation } from '@/components/navigation';
import { MakerStory } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Clock, Users } from 'lucide-react';

export default function MakerStories() {
  const [selectedStory, setSelectedStory] = useState<MakerStory | null>(null);
  
  const { data: stories = [], isLoading } = useQuery<MakerStory[]>({
    queryKey: ['/api/maker-stories'],
  });

  const handleSearch = (query: string) => {
    // Future enhancement: implement search functionality
    console.log('Search:', query);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-artisan-cream">
        <Navigation onSearch={handleSearch} />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-artisan-brown"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-artisan-cream">
      <Navigation onSearch={handleSearch} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-artisan-brown to-artisan-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Maker Stories
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            Meet the talented women artisans behind our beautiful handcrafted products. 
            Each piece tells a story of tradition, skill, and empowerment.
          </p>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {stories.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="mx-auto h-12 w-12 text-artisan-brown mb-4" />
            <h3 className="text-xl font-medium text-artisan-dark mb-2">
              Stories Coming Soon
            </h3>
            <p className="text-artisan-dark/70">
              We're working on bringing you inspiring stories from our maker community.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <Card key={story.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={story.imageUrl}
                    alt={story.makerName}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{story.makerName}</h3>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{story.location}</span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="bg-artisan-beige text-artisan-brown">
                      {story.craftsSpecialty}
                    </Badge>
                    {story.yearsOfExperience && (
                      <Badge variant="outline" className="border-artisan-brown text-artisan-brown">
                        <Clock className="h-3 w-3 mr-1" />
                        {story.yearsOfExperience} years
                      </Badge>
                    )}
                    {story.age && (
                      <Badge variant="outline" className="border-artisan-brown text-artisan-brown">
                        {story.age} years old
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-artisan-dark/80 text-sm mb-4 line-clamp-3">
                    {story.story}
                  </p>
                  
                  {story.impactStatement && (
                    <div className="bg-artisan-beige/50 p-3 rounded-md mb-4">
                      <p className="text-artisan-brown text-sm font-medium italic">
                        "{story.impactStatement}"
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    onClick={() => setSelectedStory(story)}
                    variant="outline" 
                    className="w-full border-artisan-brown text-artisan-brown hover:bg-artisan-brown hover:text-white"
                  >
                    Read Full Story
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Story Detail Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedStory.imageUrl}
                alt={selectedStory.makerName}
                className="w-full h-64 object-cover"
              />
              <Button
                onClick={() => setSelectedStory(null)}
                className="absolute top-4 right-4 bg-white/90 text-artisan-dark hover:bg-white"
                size="sm"
              >
                ✕
              </Button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-artisan-brown">
                  {selectedStory.makerName}
                </h2>
                <div className="flex items-center text-artisan-dark">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{selectedStory.location}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge className="bg-artisan-brown text-white">
                  {selectedStory.craftsSpecialty}
                </Badge>
                {selectedStory.occupation && (
                  <Badge variant="secondary">
                    {selectedStory.occupation}
                  </Badge>
                )}
                {selectedStory.yearsOfExperience && (
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    {selectedStory.yearsOfExperience} years experience
                  </Badge>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-artisan-brown mb-2">Her Story</h3>
                  <p className="text-artisan-dark leading-relaxed">
                    {selectedStory.story}
                  </p>
                </div>
                
                {selectedStory.familyInfo && (
                  <div>
                    <h3 className="font-semibold text-artisan-brown mb-2 flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Family
                    </h3>
                    <p className="text-artisan-dark">
                      {selectedStory.familyInfo}
                    </p>
                  </div>
                )}
                
                {selectedStory.impactStatement && (
                  <div className="bg-artisan-beige/30 p-4 rounded-lg">
                    <h3 className="font-semibold text-artisan-brown mb-2 flex items-center">
                      <Heart className="h-4 w-4 mr-2" />
                      Impact
                    </h3>
                    <p className="text-artisan-brown font-medium italic">
                      "{selectedStory.impactStatement}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}