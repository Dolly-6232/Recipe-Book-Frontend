const Footer = () => {
    return (
        <footer className="bg-transparent text-white py-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">My Recipe Book</h3>
                        <p className="text-gray-300">
                            Discover and share amazing recipes from around the world.
                            Cook, create, and inspire others with your culinary creations.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/" className="text-gray-300 hover:text-white transition-colors">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="/add-recipe" className="text-gray-300 hover:text-white transition-colors">
                                    Add Recipe
                                </a>
                            </li>
                            <li>
                                <a href="/profile" className="text-gray-300 hover:text-white transition-colors">
                                    Profile
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Connect</h3>
                        <div className="space-y-2">
                            <p className="text-gray-300">
                                Follow us for more recipes and cooking tips
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                    Facebook
                                </a>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                    Instagram
                                </a>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                    Twitter
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-700 mt-8 pt-6 text-center">
                    <p className="text-gray-400">
                        © 2026 My Recipe Book. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
