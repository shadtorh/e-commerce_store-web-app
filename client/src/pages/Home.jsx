import React from "react";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedProduct from "../components/FeaturedProduct";

const Home = () => {
	return (
		<>
			<Hero />
			<Categories />
			<FeaturedProduct />
			<Footer />
		</>
	);
};

export default Home;
