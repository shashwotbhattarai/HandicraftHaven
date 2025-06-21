import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MakerStory, InsertMakerStory } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Heart, MapPin, Clock } from 'lucide-react';

export function MakerStoriesManagement() {
  const [selectedStory, setSelectedStory] = useState<MakerStory | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<InsertMakerStory>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stories = [], isLoading } = useQuery<MakerStory[]>({
    queryKey: ['/api/maker-stories'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertMakerStory) => {
      const response = await fetch('/api/maker-stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create maker story');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/maker-stories'] });
      setIsDialogOpen(false);
      setFormData({});
      toast({ title: 'Maker story created successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to create maker story', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; story: Partial<InsertMakerStory> }) => {
      const response = await fetch(`/api/maker-stories/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.story),
      });
      if (!response.ok) throw new Error('Failed to update maker story');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/maker-stories'] });
      setIsDialogOpen(false);
      setSelectedStory(null);
      setFormData({});
      toast({ title: 'Maker story updated successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to update maker story', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/maker-stories/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete maker story');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/maker-stories'] });
      toast({ title: 'Maker story deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to delete maker story', variant: 'destructive' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.makerName || !formData.location || !formData.story || !formData.imageUrl || !formData.craftsSpecialty) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    const storyData: InsertMakerStory = {
      makerName: formData.makerName,
      age: formData.age,
      location: formData.location,
      story: formData.story,
      imageUrl: formData.imageUrl,
      occupation: formData.occupation,
      familyInfo: formData.familyInfo,
      craftsSpecialty: formData.craftsSpecialty,
      yearsOfExperience: formData.yearsOfExperience,
      impactStatement: formData.impactStatement,
      isActive: formData.isActive ?? true,
      order: formData.order ?? 0,
    };

    if (selectedStory) {
      updateMutation.mutate({ id: selectedStory.id, story: storyData });
    } else {
      createMutation.mutate(storyData);
    }
  };

  const handleEdit = (story: MakerStory) => {
    setSelectedStory(story);
    setFormData({
      makerName: story.makerName,
      age: story.age,
      location: story.location,
      story: story.story,
      imageUrl: story.imageUrl,
      occupation: story.occupation,
      familyInfo: story.familyInfo,
      craftsSpecialty: story.craftsSpecialty,
      yearsOfExperience: story.yearsOfExperience,
      impactStatement: story.impactStatement,
      isActive: story.isActive,
      order: story.order,
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedStory(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-artisan-brown"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-artisan-dark">Maker Stories</h2>
          <p className="text-artisan-medium">Manage inspiring stories from your artisan community</p>
        </div>
        <Button onClick={handleAdd} className="bg-artisan-brown hover:bg-artisan-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add New Story
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <Card key={story.id} className="overflow-hidden">
            <div className="relative h-48">
              <img
                src={story.imageUrl}
                alt={story.makerName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <h3 className="font-bold">{story.makerName}</h3>
                <div className="flex items-center text-sm">
                  <MapPin className="h-3 w-3 mr-1" />
                  {story.location}
                </div>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary" className="bg-artisan-beige text-artisan-brown">
                  {story.craftsSpecialty}
                </Badge>
                {story.yearsOfExperience && (
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    {story.yearsOfExperience}y exp
                  </Badge>
                )}
                {!story.isActive && (
                  <Badge variant="destructive">Inactive</Badge>
                )}
              </div>
              
              <p className="text-sm text-artisan-dark/80 mb-4 line-clamp-3">
                {story.story}
              </p>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-artisan-medium">
                  Order: {story.order}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(story)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(story.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {stories.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="mx-auto h-12 w-12 text-artisan-brown mb-4" />
            <h3 className="text-xl font-semibold text-artisan-dark mb-2">
              No Maker Stories Yet
            </h3>
            <p className="text-artisan-medium mb-4">
              Start sharing the inspiring stories of your artisan community.
            </p>
            <Button onClick={handleAdd} className="bg-artisan-brown hover:bg-artisan-dark">
              <Plus className="h-4 w-4 mr-2" />
              Add First Story
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedStory ? 'Edit Maker Story' : 'Add New Maker Story'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="makerName">Maker Name *</Label>
                <Input
                  id="makerName"
                  value={formData.makerName || ''}
                  onChange={(e) => setFormData({ ...formData, makerName: e.target.value })}
                  placeholder="Enter maker's name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age || ''}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || undefined })}
                  placeholder="Enter age"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Enter location"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="craftsSpecialty">Craft Specialty *</Label>
                <Input
                  id="craftsSpecialty"
                  value={formData.craftsSpecialty || ''}
                  onChange={(e) => setFormData({ ...formData, craftsSpecialty: e.target.value })}
                  placeholder="e.g., Pottery, Weaving, Knitting"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={formData.occupation || ''}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  placeholder="Enter occupation"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                <Input
                  id="yearsOfExperience"
                  type="number"
                  value={formData.yearsOfExperience || ''}
                  onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || undefined })}
                  placeholder="Years of experience"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL *</Label>
              <Input
                id="imageUrl"
                type="url"
                value={formData.imageUrl || ''}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="story">Story *</Label>
              <Textarea
                id="story"
                value={formData.story || ''}
                onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                placeholder="Tell the maker's inspiring story..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="familyInfo">Family Information</Label>
              <Textarea
                id="familyInfo"
                value={formData.familyInfo || ''}
                onChange={(e) => setFormData({ ...formData, familyInfo: e.target.value })}
                placeholder="Information about family, children, etc."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="impactStatement">Impact Statement</Label>
              <Textarea
                id="impactStatement"
                value={formData.impactStatement || ''}
                onChange={(e) => setFormData({ ...formData, impactStatement: e.target.value })}
                placeholder="How has this opportunity impacted their life?"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order || 0}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive ?? true}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-artisan-brown hover:bg-artisan-dark"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {selectedStory ? 'Update Story' : 'Create Story'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}