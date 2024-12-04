import React, { useState, useEffect, useContext } from 'react';
import { AuthProvider, AuthContext } from './components/auth/AuthContext';
import { Nav } from './components/layout/Nav';
import { RecipeList } from './components/recipes/RecipeList';
import { Login } from './components/auth/Login';


import './App.css';
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const { token } = React.useContext(AuthContext);

  // Redirect to login if not authenticated
  // useEffect(() => {
  //   if (!token && currentPage !== 'login') {
  //     setCurrentPage('login');
  //   }
  // }, [token, currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login />;
      case 'cookbook':
        return <div>My Cookbook Page</div>;
      case 'create':
        return <div>Create Recipe Page</div>;
      default:
        // return <div>hi</div>;
        return <RecipeList />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="container mx-auto px-4 py-8">
        {renderPage()}
      </main>
    </div>
  );
};


// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/067c84b8-ef7c-4f55-8d96-afabc05cc213/dfyooda-b7b2785f-d01b-49b1-8756-d6846402ad7a.png/v1/fill/w_960,h_832/bob_the_tomato__2000__render_by_janiceemmonsfan1990_dfyooda-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjMyMCIsInBhdGgiOiJcL2ZcLzA2N2M4NGI4LWVmN2MtNGY1NS04ZDk2LWFmYWJjMDVjYzIxM1wvZGZ5b29kYS1iN2IyNzg1Zi1kMDFiLTQ5YjEtODc1Ni1kNjg0NjQwMmFkN2EucG5nIiwid2lkdGgiOiI8PTI2NzcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.d79cO6q5aVqVCt7t1qfJQpJxJ1JcoBvpL3ozQiXJ10k" className="App-logo" alt="logo" />
//         <p>
//           Welcome to Recipe Share!
//         </p>
        
//       </header>
//     </div>
//   );
// }

export default App;
