import Hero from './components/Hero';
import Navbar from './components/Navbar';

function App() {
  // Only show navbar and hero

  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-50 via-white to-ocean-50">
  <div id="top" />
  <Navbar />
      <Hero />
    </div>
  );
}

export default App;
