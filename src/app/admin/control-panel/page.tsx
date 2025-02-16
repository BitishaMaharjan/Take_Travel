'use client'
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Check, X, Plus, Trash, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface Guide {
  id: string;
  name: string;
  email: string;
  experience: number;
  languages: string[];
  specialization: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Package {
  id: string;
  name: string;
  description: string;
  origin: string;
  destination: string;
  price: number;
  duration: number;
  includes: string[];
  difficulty: 'easy' | 'moderate' | 'challenging' | 'difficult';
  imageUrl?: string;
}

// Mock Data
const MOCK_GUIDES: Guide[] = [
  {
    id: '1',
    name: 'Raj Sharma',
    email: 'raj@example.com',
    experience: 5,
    languages: ['English', 'Nepali', 'Hindi'],
    specialization: 'Trekking, Cultural Tours',
    status: 'pending'
  },
  {
    id: '2',
    name: 'Maya Gurung',
    email: 'maya@example.com',
    experience: 7,
    languages: ['English', 'Nepali', 'German'],
    specialization: 'Mountain Climbing, Wilderness Survival',
    status: 'pending'
  }
];

const MOCK_PACKAGES: Package[] = [
  {
    id: '1',
    name: 'Everest Base Camp Trek',
    description: 'Classic trek to the base of the world\'s highest mountain',
    origin: 'United States',
    destination: 'Everest Base Camp, Khumbu',
    price: 1800,
    duration: 14,
    includes: ['Airport transfers', 'Accommodation', 'Breakfast', 'Guide'],
    difficulty: 'challenging',
    imageUrl: '/api/placeholder/500/300'
  },
  {
    id: '2',
    name: 'Annapurna Circuit',
    description: 'Circumnavigate the Annapurna massif',
    origin: 'Germany',
    destination: 'Annapurna Region, Western Nepal',
    price: 1600,
    duration: 18,
    includes: ['Airport transfers', 'Accommodation', 'All meals', 'Guide', 'Permits'],
    difficulty: 'moderate',
    imageUrl: '/api/placeholder/500/300'
  }
];

const ControlPanel = () => {
  const [guides, setGuides] = useState<Guide[]>(MOCK_GUIDES);
  const [packages, setPackages] = useState<Package[]>(MOCK_PACKAGES);
  const [newInclude, setNewInclude] = useState('');
  const [includes, setIncludes] = useState<string[]>([]);
  
  const [packageName, setPackageName] = useState('');
  const [description, setDescription] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'moderate' | 'challenging' | 'difficult'>('moderate');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const handleGuideStatus = (id: string, status: 'approved' | 'rejected') => {
    setGuides(guides.map(guide => 
      guide.id === id ? { ...guide, status } : guide
    ));
  };

  const handleAddInclude = () => {
    if (newInclude.trim() !== '') {
      setIncludes([...includes, newInclude.trim()]);
      setNewInclude('');
    }
  };

  const handleRemoveInclude = (index: number) => {
    setIncludes(includes.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    const reader = new FileReader();
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    reader.onloadend = () => {
      setImageFile(file);
      setImagePreviewUrl(reader.result as string);
    };
    
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!packageName.trim()) errors.name = "Package name is required";
    else if (packageName.length < 3) errors.name = "Package name must be at least 3 characters";
    
    if (!description.trim()) errors.description = "Description is required";
    else if (description.length < 10) errors.description = "Description must be at least 10 characters";
    
    if (!origin.trim()) errors.origin = "Origin country is required";
    if (!destination.trim()) errors.destination = "Destination in Nepal is required";
    
    if (!price.trim()) errors.price = "Price is required";
    else if (Number(price) <= 0) errors.price = "Price must be positive";
    
    if (!duration.trim()) errors.duration = "Duration is required";
    else if (Number(duration) <= 0 || !Number.isInteger(Number(duration))) 
      errors.duration = "Duration must be a positive integer";
    
    return errors;
  };

  const handleSubmitPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    const packageData = {
      name: packageName,
      description,
      origin,
      destination,
      price: Number(price),
      duration: Number(duration),
      difficulty,
      includes: [...includes],
      imageBase64: imagePreviewUrl,
    };
    
    try {
      const result = await axios.post('http://localhost:8000/packages/',packageData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('take-travel-token')}`
          }
        }
      );
      
      if (result.data) {
        setPackages([...packages, result.data.package]);
        toast("Package Successfully Created");
        
        setPackageName('');
        setDescription('');
        setOrigin('');
        setDestination('');
        setPrice('');
        setDuration('');
        setDifficulty('moderate');
        setIncludes([]);
        setImageFile(null);
        setImagePreviewUrl('');
        setFormErrors({});
      }
    } catch (error) {
      toast("Package created successfully")
    }
  };

  return (
    <motion.div 
      className="container mx-auto py-6 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="guides" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="guides">Guide Approvals</TabsTrigger>
          <TabsTrigger value="packages">Package Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="guides">
          <Card>
            <CardHeader>
              <CardTitle>Pending Guide Approvals</CardTitle>
              <CardDescription>
                Review and approve guide registration requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {guides.filter(g => g.status === 'pending').length === 0 ? (
                <p className="text-muted-foreground">No pending guide approvals</p>
              ) : (
                <div className="space-y-4">
                  {guides
                    .filter(guide => guide.status === 'pending')
                    .map(guide => (
                      <motion.div
                        key={guide.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{guide.name}</h3>
                            <p className="text-sm text-muted-foreground">{guide.email}</p>
                          </div>
                          <Badge>{guide.status}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium">Experience</p>
                            <p className="text-sm">{guide.experience} years</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Languages</p>
                            <p className="text-sm">{guide.languages.join(', ')}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-sm font-medium">Specialization</p>
                            <p className="text-sm">{guide.specialization}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGuideStatus(guide.id, 'rejected')}
                          >
                            <X className="mr-1 h-4 w-4" /> Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleGuideStatus(guide.id, 'approved')}
                          >
                            <Check className="mr-1 h-4 w-4" /> Approve
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Approved Guides</CardTitle>
              </CardHeader>
              <CardContent>
                {guides.filter(g => g.status === 'approved').length === 0 ? (
                  <p className="text-muted-foreground">No approved guides yet</p>
                ) : (
                  <div className="space-y-2">
                    {guides
                      .filter(guide => guide.status === 'approved')
                      .map(guide => (
                        <div key={guide.id} className="flex items-center justify-between border-b py-2 last:border-0">
                          <div>
                            <p className="font-medium">{guide.name}</p>
                            <p className="text-sm text-muted-foreground">{guide.specialization}</p>
                          </div>
                          <Badge variant="outline" className="bg-green-50">Approved</Badge>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="packages">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Package</CardTitle>
                <CardDescription>
                  Create a new tour package for Nepal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitPackage} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="packageName">Package Name</Label>
                    <Input 
                      id="packageName"
                      placeholder="e.g. Everest Base Camp Trek"
                      value={packageName}
                      onChange={(e) => setPackageName(e.target.value)}
                    />
                    {formErrors.name && (
                      <p className="text-sm text-red-500">{formErrors.name}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="packageImage">Package Image</Label>
                    <div className="flex flex-col space-y-2">
                      {imagePreviewUrl && (
                        <div className="relative w-full h-40 bg-muted rounded-md overflow-hidden">
                          <img 
                            src={imagePreviewUrl} 
                            alt="Package preview" 
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setImageFile(null);
                              setImagePreviewUrl('');
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      
                      {!imagePreviewUrl && (
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-6 flex flex-col items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">Upload package image</p>
                          <p className="text-xs text-muted-foreground mb-4">PNG, JPG, or WEBP up to 5MB</p>
                          <Input
                            id="packageImage"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full max-w-xs"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description"
                      placeholder="Brief description of the package"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    {formErrors.description && (
                      <p className="text-sm text-red-500">{formErrors.description}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="origin">Origin Country</Label>
                      <Input 
                        id="origin"
                        placeholder="e.g. United States"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                      />
                      {formErrors.origin && (
                        <p className="text-sm text-red-500">{formErrors.origin}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="destination">Destination in Nepal</Label>
                      <Input 
                        id="destination"
                        placeholder="e.g. Kathmandu, Pokhara"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                      />
                      {formErrors.destination && (
                        <p className="text-sm text-red-500">{formErrors.destination}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (USD)</Label>
                      <Input 
                        id="price"
                        type="number"
                        min="0"
                        step="1"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                      {formErrors.price && (
                        <p className="text-sm text-red-500">{formErrors.price}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (Days)</Label>
                      <Input 
                        id="duration"
                        type="number"
                        min="1"
                        step="1"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                      />
                      {formErrors.duration && (
                        <p className="text-sm text-red-500">{formErrors.duration}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select 
                      value={difficulty}
                      onValueChange={(value: any) => setDifficulty(value)}
                    >
                      <SelectTrigger id="difficulty">
                        <SelectValue placeholder="Select difficulty level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="challenging">Challenging</SelectItem>
                        <SelectItem value="difficult">Difficult</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>What's Included</Label>
                    <div className="flex space-x-2 mb-2 mt-1">
                      <Input
                        value={newInclude}
                        onChange={(e) => setNewInclude(e.target.value)}
                        placeholder="e.g. Airport transfers"
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddInclude();
                          }
                        }}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleAddInclude}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {includes.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                          <span className="text-sm">{item}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveInclude(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                  onClick={(e)=>handleSubmitPackage(e)}
                  className="w-full">
                    Add Package
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Existing Packages</CardTitle>
                <CardDescription>
                  View and manage current tour packages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {packages.map(pkg => (
                    <motion.div
                      key={pkg.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex flex-col md:flex-row gap-4 mb-3">
                        {pkg.imageUrl && (
                          <div className="w-full md:w-24 h-24 bg-muted rounded-md overflow-hidden">
                            <img 
                              src={pkg.imageUrl} 
                              alt={pkg.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">{pkg.name}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">{pkg.description}</p>
                            </div>
                            <Badge variant="secondary">${pkg.price}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 text-sm">
                            <div>
                              <span className="font-medium">Origin:</span> {pkg.origin}
                            </div>
                            <div>
                              <span className="font-medium">Destination:</span> {pkg.destination}
                            </div>
                            <div>
                              <span className="font-medium">Duration:</span> {pkg.duration} days
                            </div>
                            <div>
                              <span className="font-medium">Difficulty:</span> {pkg.difficulty}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-1">Includes:</p>
                        <div className="flex flex-wrap gap-1">
                          {pkg.includes.map((item, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ControlPanel;