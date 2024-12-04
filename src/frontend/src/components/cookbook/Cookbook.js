import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { Card, CardContent, Typography, Grid, Box, Chip, Button } from '@mui/material';
import { Star, Bookmark, User } from 'lucide-react';

export const Cookbook = () => {
    const { user: authUser } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    console.log("authuser:");
    console.log(authUser);

  
    useEffect(() => {
        if (authUser?.id) fetchUserData();
        // fetchSavedRecipes();
      }, [authUser]);
    
  
      const fetchUserData = async () => { 
        try {
          const response = await fetch(`http://localhost:8000/users/${authUser.id}`);
          const userData = await response.json();
          setUser(userData);
          fetchSavedRecipes(userData.saved_recipes);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setLoading(false);
        }
      };
    
      if (loading) return <Box sx={{ py: 4 }}>Loading...</Box>;
      if (!user) return <Box sx={{ py: 4 }}>No user data found</Box>;
      

    const fetchSavedRecipes = async () => { 
        try {
        const promises = user.saved_recipes.map(id =>
            fetch(`http://localhost:8000/recipe/${id}`).then(res => res.json())
        );
        const recipes = await Promise.all(promises);
        setSavedRecipes(recipes);
        } catch (error) {
        console.error('Error fetching saved recipes:', error);
        } finally {
        setLoading(false);
        }
    };

  const handleUnsave = async (recipeId) => {
    try {
      await fetch(`http://localhost:8000/users/${user.name}/unsave_recipe/${recipeId}`, {
        method: 'POST'
      });
      setSavedRecipes(recipes => recipes.filter(recipe => recipe._id !== recipeId));
    } catch (error) {
      console.error('Error unsaving recipe:', error);
    }
  };

  console.log(user);
  fetchSavedRecipes();

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <User size={64} className="mx-auto mb-4" />
        <Typography variant="h4" gutterBottom>
        {user.name}
        </Typography>
        <Typography color="text.secondary">
          {user.email}
        </Typography>
      </Box>

      <Typography variant="h5" sx={{ mb: 4 }}>
        Saved Recipes ({savedRecipes.length})
      </Typography>

      <Grid container spacing={3}>
        {savedRecipes.map((recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe._id}>
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
                <Button
                  startIcon={<Bookmark />}
                  onClick={() => handleUnsave(recipe._id)}
                  variant="outlined"
                  color="error"
                  fullWidth
                >
                  Unsave
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};