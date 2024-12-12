import { motion } from "framer-motion";

const Footer = () => {
  const footerSections = [
    {
      title: "Product",
      links: ["Features", "Marketplace", "Trading Cards", "Statistics"]
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "Press Kit", "Contact"]
    },
    {
      title: "Resources",
      links: ["Blog", "Newsletter", "Events", "Help Center"]
    },
    {
      title: "Legal",
      links: ["Terms", "Privacy", "Cookies", "Licenses"]
    }
  ];

  const socialLinks = [
    { name: "Twitter", icon: "🐦", url: "#" },
    { name: "Discord", icon: "💬", url: "#" },
    { name: "GitHub", icon: "🐱", url: "#" },
    { name: "LinkedIn", icon: "💼", url: "#" }
  ];

  return (
    <footer className="relative bg-white border-t-4 border-black">
      <div className="max-w-6xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-16">
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="inline-block">
                <h3 className="font-display text-lg font-black text-black bg-yellow-400 px-4 py-2 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {section.title}
                </h3>
              </div>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-gray-700 hover:text-black font-medium transition-colors hover:underline decoration-2 decoration-red-500"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-12 border-t-2 border-black"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-lg">
              <h3 className="font-display text-2xl font-black text-black">Stay in the loop! 🎮</h3>
              <p className="font-body text-gray-700">Get the latest updates on new Pokemon cards and features</p>
            </div>
            <div className="flex w-full lg:w-auto gap-4">
              <input
                type="email"
                placeholder="pikachu@pokemon.com"
                className="flex-1 lg:w-80 px-4 py-3 rounded-xl bg-white border-2 border-black text-black placeholder:text-gray-500 focus:outline-none focus:border-red-500 transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="neubrutalism-button bg-red-500 text-white px-6 py-3 rounded-xl font-bold whitespace-nowrap"
              >
                Join Now →
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Social Links & Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-8 border-t-2 border-black"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-gray-700 font-medium">
              © 2024 Pokemon NFT. All rights reserved.
            </div>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  whileHover={{ scale: 1.1 }}
                  className="bg-white p-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                >
                  <span className="text-xl" role="img" aria-label={social.name}>
                    {social.icon}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Pokemon Badge */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <div className="bg-red-500 text-white font-display font-black px-6 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Gotta Catch 'Em All!
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 