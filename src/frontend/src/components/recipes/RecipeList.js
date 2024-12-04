
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
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
import { RecipeForm } from './RecipeForm';

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


export const RecipeList = () => {
  const { user: authUser } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [filter, setFilter] = useState({ category: 'all', minRating: 0 });
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, [filter]);

//   const fetchRecipes = async () => {
//     setLoading(true);
//     try {
//       await new Promise(resolve => setTimeout(resolve, 500));
//       const data = MOCK_RECIPES.filter(recipe => {
//         const matchesCategory = filter.category === 'all' || 
//           recipe.category.toLowerCase() === filter.category.toLowerCase();
//         const matchesRating = recipe.average_rating >= filter.minRating;
//         return matchesCategory && matchesRating;
//       });
//       setRecipes(data);
//       const uniqueCategories = [...new Set(data.map(recipe => recipe.category))];
//       setCategories(uniqueCategories);

//     } catch (error) {
//       console.error('Failed to fetch recipes:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

    const fetchRecipes = async () => {
        setLoading(true);
        setError('');
        try {
        let url = 'http://localhost:8000/recipe?';
        
        if (filter.category !== 'all') {
          if (categories.includes(filter.category)) {
            
            url += `category=${encodeURIComponent(filter.category)}&`;
          } else {
            setFilter({ ...filter, category: 'all' });
          }
        }
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch recipes');
        }
        
        const data = await response.json();
        const filteredData = data.filter(recipe => recipe.average_rating >= filter.minRating);
        
        setRecipes(filteredData);
        
        const uniqueCategories = [...new Set(data.map(recipe => recipe.category))];
        setCategories(uniqueCategories);
        } catch (error) {
        console.error('Failed to fetch recipes:', error);
        setError('Failed to load recipes. Please try again later.');
        } finally {
        setLoading(false);
        }
    };

  const handleRecipeAdded = (newRecipe) => {
    setRecipes([newRecipe, ...recipes]);
    if (!categories.includes(newRecipe.category)) {
        setCategories(prev => [...prev, newRecipe.category]);
    }
  };

  const handleSave = async (recipeId) => {
    try {
      
      console.log(authUser);
      console.log("hello");
      const response = await fetch(`http://localhost:8000/users/${authUser.id}/save_recipe/${recipeId}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to save recipe');
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  const handleRate = async (recipeId) => {
    try {
      const rating = prompt("Rate this recipe (0-5):", "5");
      if (rating === null) return;
      
      const ratingNum = parseFloat(rating);
      if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
        alert("Please enter a valid rating between 0 and 5");
        return;
      }
  
      const response = await fetch(`http://localhost:8000/recipe/${recipeId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating: ratingNum }),
      });
      
      if (!response.ok) throw new Error('Failed to rate recipe');
      
      const updatedRecipe = await response.json();
      setRecipes(prevRecipes => 
        prevRecipes.map(recipe => 
          recipe._id === recipeId ? updatedRecipe : recipe
        )
      );
    } catch (error) {
      console.error('Error rating recipe:', error);
    }
  };

//   const categories = [...new Set(MOCK_RECIPES.map(recipe => recipe.category))];

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
                  value={categories.includes(filter.category) ? filter.category : 'all'}
                  label="Category"
                  onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
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

        {loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Discovering recipes...</Typography>
          </Box>
        )}

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

        {error && (
            <Paper sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" component="span" sx={{ mb: 2, display: 'block' }}>
              Error: {error}
            </Typography>
          </Paper>
        )}

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
                      onClick={() => handleSave(recipe._id)}
                      fullWidth
                    >
                      Save
                    </Button>
                    <Button 
                      variant="contained" 
                    //   startIcon={<Grade />}
                      onClick={() => handleRate(recipe._id)}
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
        <RecipeForm onRecipeAdded={handleRecipeAdded} />
      </Container>
    </Box>
    </ThemeProvider>
  );
};

// export default RecipeList;