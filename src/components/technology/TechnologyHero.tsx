
import { motion } from "framer-motion";

const TechnologyHero = () => {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 md:space-y-8"
        >
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900">
            Technology That 
            <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Powers Healthcare
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At CareBow, we leverage cutting-edge artificial intelligence, secure cloud infrastructure, 
            and intuitive design to revolutionize how healthcare is delivered at home.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TechnologyHero;
