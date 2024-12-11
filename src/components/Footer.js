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
    { name: "Twitter", url: "#" },
    { name: "Discord", url: "#" },
    { name: "GitHub", url: "#" },
    { name: "LinkedIn", url: "#" }
  ];

  return (
    <footer className="relative overflow-hidden bg-[#0A0A0F]">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse-slow" />
        <div className="absolute inset-0 bg-grid" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-20">
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-white text-lg">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
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
          className="py-12 border-t border-white/10"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-lg">
              <h3 className="text-white text-lg">Stay up to date</h3>
              <p className="text-gray-400">Get the latest updates on our products and services</p>
            </div>
            <div className="flex w-full lg:w-auto gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 lg:w-80 px-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-white hover:bg-white/20 transition-all duration-300"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-8 border-t border-white/10"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="text-gray-400 text-sm">
              © 2024 Your Company. All rights reserved.
            </div>
            <div className="flex gap-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 