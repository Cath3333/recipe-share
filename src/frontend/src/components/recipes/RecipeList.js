import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  Select,
  MenuItem,
  TextField,
  Button,
  FormControl,
  InputLabel,
  CircularProgress,
  Chip,
  Paper,
  ThemeProvider,
} from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { Search, Star } from 'lucide-react';

const theme = createTheme({
    palette: {
      primary: {
        main: '#E86A33', // Warm orange
        light: '#FF8F5C',
        dark: '#D35400',
      },
      secondary: {
        main: '#F2BE22', // Warm yellow
        light: '#FFD54F',
        dark: '#C49000',
      },
      background: {
        default: '#FFF9F2', // Warm off-white
        paper: '#FFFFFF',
      },
      text: {
        primary: '#2C1810', // Warm dark brown
        secondary: '#8B4513', // Saddle brown
      },
      error: {
        main: '#D84315', // Warm red
      },
      warning: {
        main: '#FF9800', // Orange
      },
      success: {
        main: '#869D7A', // Muted green
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: '1px solid #FFE4D6',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
          },
        },
      },
    },
  });

const MOCK_RECIPES = [
  {
    id: '1',
    title: 'Classic Spaghetti Carbonara',
    description: 'Traditional Italian pasta dish with eggs, cheese, pancetta and black pepper',
    category: 'Italian',
    average_rating: 4.8,
    author_id: 'user1',
    ingredients: ['spaghetti', 'eggs', 'pecorino cheese', 'pancetta', 'black pepper'],
    instructions: ['Boil pasta', 'Cook pancetta', 'Mix eggs and cheese', 'Combine all ingredients'],
  },
  {
    id: '2',
    title: 'Chicken Tikka Masala',
    description: 'Grilled chicken in a rich and creamy curry sauce',
    category: 'Indian',
    average_rating: 4.5,
    author_id: 'user2',
    ingredients: ['chicken', 'yogurt', 'tomatoes', 'cream', 'spices'],
    instructions: ['Marinate chicken', 'Grill chicken', 'Prepare sauce', 'Combine and simmer'],
  },
  {
    id: '3',
    title: 'Vegetarian Buddha Bowl',
    description: 'Healthy bowl with quinoa, roasted vegetables, and tahini dressing',
    category: 'Vegetarian',
    average_rating: 4.2,
    author_id: 'user3',
    ingredients: ['quinoa', 'sweet potato', 'chickpeas', 'kale', 'tahini'],
    instructions: ['Cook quinoa', 'Roast vegetables', 'Prepare dressing', 'Assemble bowl'],
  },
  {
    id: '4',
    title: 'Classic Beef Burger',
    description: 'Juicy homemade beef burger with all the trimmings',
    category: 'American',
    average_rating: 4.6,
    author_id: 'user1',
    ingredients: ['ground beef', 'onion', 'lettuce', 'tomato', 'cheese'],
    instructions: ['Form patties', 'Grill burgers', 'Toast buns', 'Assemble burgers'],
  },
  {
    id: '5',
    title: 'Green Smoothie Bowl',
    description: 'Nutritious smoothie bowl with spinach, banana, and toppings',
    category: 'Breakfast',
    average_rating: 4.0,
    author_id: 'user2',
    ingredients: ['spinach', 'banana', 'almond milk', 'chia seeds', 'granola'],
    instructions: ['Blend ingredients', 'Pour in bowl', 'Add toppings', 'Serve immediately'],
  }
];

export const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [filter, setFilter] = useState({ category: 'all', minRating: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, [filter]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const data = MOCK_RECIPES.filter(recipe => {
        const matchesCategory = filter.category === 'all' || 
          recipe.category.toLowerCase() === filter.category.toLowerCase();
        const matchesRating = recipe.average_rating >= filter.minRating;
        return matchesCategory && matchesRating;
      });
      setRecipes(data);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (recipeId) => {
    console.log('Saved recipe:', recipeId);
  };

  const handleRate = async (recipeId) => {
    console.log('Rating recipe:', recipeId);
  };

  const categories = [...new Set(MOCK_RECIPES.map(recipe => recipe.category))];

  return (
    <ThemeProvider theme={theme}>
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" component="h1" gutterBottom>
             Recipe Share
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            Add and discover your favorite recipes!
          </Typography>
        </Box>

        {/* Filters */}
        <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Filter Recipes
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filter.category}
                  label="Category"
                  onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category.toLowerCase()}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Minimum Rating"
                value={filter.minRating}
                onChange={(e) => setFilter({ ...filter, minRating: Number(e.target.value) || 0 })}
                InputProps={{
                  inputProps: { min: 0, max: 5, step: 0.1 }
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Loading State */}
        {loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Discovering recipes...</Typography>
          </Box>
        )}

        {/* Empty State */}
        {!loading && recipes.length === 0 && (
          <Paper sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" component="span" sx={{ mb: 2, display: 'block' }}>
              🍳
            </Typography>
            <Typography variant="h6" gutterBottom>
              No recipes found
            </Typography>
            <Typography color="text.secondary">
              Try adjusting your search filters
            </Typography>
          </Paper>
        )}

        {/* Recipe Grid */}
        {!loading && recipes.length > 0 && (
          <Grid container spacing={3}>
            {recipes.map((recipe) => (
              <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {recipe.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {recipe.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Chip label={recipe.category} size="small" />
                      <Chip 
                        icon={<Star size={16} />}
                        label={recipe.average_rating}
                        size="small"
                        color="primary"
                      />
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                      variant="outlined" 
                    //   startIcon={<SaveAlt />}
                      onClick={() => handleSave(recipe.id)}
                      fullWidth
                    >
                      Save
                    </Button>
                    <Button 
                      variant="contained" 
                    //   startIcon={<Grade />}
                      onClick={() => handleRate(recipe.id)}
                      fullWidth
                    >
                      Rate
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
    </ThemeProvider>
  );
};

// export default RecipeList;