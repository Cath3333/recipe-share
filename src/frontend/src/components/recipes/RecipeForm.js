import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Alert,
} from '@mui/material';
import { Plus } from 'lucide-react';

export const RecipeForm = ({ onRecipeAdded }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    category: '',
    ingredients: [],
    instructions: [],
    author_id: 'user1', // This would come from auth in a real app
    average_rating: 0
  });
  const [newIngredient, setNewIngredient] = useState('');
  const [newInstruction, setNewInstruction] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError('');
    setRecipe({
      title: '',
      description: '',
      category: '',
      ingredients: [],
      instructions: [],
      author_id: 'user1',
      average_rating: 0
    });
  };

  const handleChange = (e) => {
    setRecipe({
      ...recipe,
      [e.target.name]: e.target.value
    });
  };

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setRecipe({
        ...recipe,
        ingredients: [...recipe.ingredients, newIngredient.trim()]
      });
      setNewIngredient('');
    }
  };

  const removeIngredient = (index) => {
    setRecipe({
      ...recipe,
      ingredients: recipe.ingredients.filter((_, i) => i !== index)
    });
  };

  const addInstruction = () => {
    if (newInstruction.trim()) {
      setRecipe({
        ...recipe,
        instructions: [...recipe.instructions, newInstruction.trim()]
      });
      setNewInstruction('');
    }
  };

  const removeInstruction = (index) => {
    setRecipe({
      ...recipe,
      instructions: recipe.instructions.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add recipe');
      }

      const newRecipe = await response.json();
      onRecipeAdded(newRecipe);
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Plus size={20} />}
        onClick={handleOpen}
        sx={{ position: 'fixed', bottom: 32, right: 32 }}
      >
        Add Recipe
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add New Recipe</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={3}>
              {error && <Alert severity="error">{error}</Alert>}
              
              <TextField
                required
                fullWidth
                label="Recipe Title"
                name="title"
                value={recipe.title}
                onChange={handleChange}
              />

              <TextField
                required
                fullWidth
                multiline
                rows={2}
                label="Description"
                name="description"
                value={recipe.description}
                onChange={handleChange}
              />

              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={recipe.category}
                  onChange={handleChange}
                  label="Category"
                >
                  <MenuItem value="Italian">Italian</MenuItem>
                  <MenuItem value="Indian">Indian</MenuItem>
                  <MenuItem value="American">American</MenuItem>
                  <MenuItem value="Vegetarian">Vegetarian</MenuItem>
                  <MenuItem value="Breakfast">Breakfast</MenuItem>
                </Select>
              </FormControl>

              <Box>
                <Stack direction="row" spacing={1} mb={1}>
                  <TextField
                    fullWidth
                    label="Add Ingredient"
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                  />
                  <Button onClick={addIngredient}><Plus size={20} /></Button>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {recipe.ingredients.map((ingredient, index) => (
                    <Chip
                      key={index}
                      label={ingredient}
                      onDelete={() => removeIngredient(index)}
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Stack>
              </Box>

              <Box>
                <Stack direction="row" spacing={1} mb={1}>
                  <TextField
                    fullWidth
                    label="Add Instruction"
                    value={newInstruction}
                    onChange={(e) => setNewInstruction(e.target.value)}
                  />
                  <Button onClick={addInstruction}><Plus size={20} /></Button>
                </Stack>
                {recipe.instructions.map((instruction, index) => (
                  <Chip
                    key={index}
                    label={`Step ${index + 1}: ${instruction}`}
                    sx={{ m: 0.5 }}
                    onDelete={() => removeInstruction(index)}
                  />
                ))}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading || 
                !recipe.title || 
                !recipe.description || 
                !recipe.category ||
                recipe.ingredients.length === 0 ||
                recipe.instructions.length === 0}
            >
              {loading ? 'Adding...' : 'Add Recipe'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};