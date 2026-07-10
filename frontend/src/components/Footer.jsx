const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-xl font-bold text-white mb-3">3M Shop</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Your one-stop shop for quality products at unbeatable prices.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <a href="/products" className="text-sm hover:text-emerald-400 transition-colors duration-200">Products</a>
              <a href="/cart" className="text-sm hover:text-emerald-400 transition-colors duration-200">Cart</a>
              <a href="/profile" className="text-sm hover:text-emerald-400 transition-colors duration-200">Profile</a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact</h4>
            <div className="flex flex-col gap-2 text-sm">
              <p>support@3mshop.com</p>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>&copy; 2026 3M Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
