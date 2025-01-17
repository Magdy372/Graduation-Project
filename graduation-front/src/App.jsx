import Hero from "./components/Hero/Hero";
import Services from "./components/Services/Services";
import Banner from "./components/Banner/Banner";
import Sponsers from "./components/Sponsers/Sponsers";
import Footer from "./components/Footer/Footer";
const App = () => {
  return (
    <main className="overflow-x-hidden bg-white text-blue">
       <Hero />
      <Services />
      <Banner/>
      <Sponsers/>
      <Footer /> 
      
     </main>
  )
}
export default App;
