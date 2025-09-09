"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

interface Tale {
  id: number;
  title: string;
  text: string;
  nation: string;
  source: string;
}

export default function ExplorePage() {
  const [tales, setTales] = useState<Tale[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTaleIndex, setSelectedTaleIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [nationFilter, setNationFilter] = useState("");
  const [nations, setNations] = useState<string[]>([]);
  const [limit, setLimit] = useState(12);
  const [isOffline, setIsOffline] = useState(false);

  // Fetch offline tales from public folder
  const fetchOfflineTales = async () => {
    const res = await fetch("/data/offlineTales.json");
    const data: Tale[] = await res.json();
    return data;
  };

  // Fetch Tales
  const fetchTales = async () => {
    setLoading(true);

    if (!navigator.onLine) {
      const offlineData = await fetchOfflineTales();
      setTales(offlineData.slice(0, 6));
      setIsOffline(true);
      setLoading(false);
      return;
    }

    setIsOffline(false);
    let query = supabase.from("tales").select("*").limit(limit);

    if (search) query = query.ilike("title", `%${search}%`);
    if (nationFilter) query = query.eq("nation", nationFilter);

    const { data } = await query;
    if (data) setTales(data);
    setLoading(false);
  };

  // Fetch nations
  const fetchNations = async () => {
    if (!navigator.onLine) {
      const offlineData = await fetchOfflineTales();
      const uniqueNations = Array.from(new Set(offlineData.map((t) => t.nation)));
      setNations(uniqueNations);
      return;
    }

    const { data } = await supabase.from("tales").select("nation");
    if (data) {
      const uniqueNations = Array.from(new Set(data.map((item: any) => item.nation)));
      setNations(uniqueNations);
    }
  };

  useEffect(() => {
    fetchTales();
    fetchNations();
  }, [search, nationFilter, limit]);

  // Full-screen tale handlers
  const openTale = (index: number) => setSelectedTaleIndex(index);
  const closeTale = () => setSelectedTaleIndex(null);
  const prevTale = () => {
    if (selectedTaleIndex !== null && selectedTaleIndex > 0) setSelectedTaleIndex(selectedTaleIndex - 1);
  };
  const nextTale = () => {
    if (selectedTaleIndex !== null && selectedTaleIndex < tales.length - 1) setSelectedTaleIndex(selectedTaleIndex + 1);
  };
  const loadMore = () => setLimit((prev) => prev + 12);

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-500 relative overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative h-72 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/exploree.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20"></div>
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-white z-10 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Explore Folktales
        </motion.h1>
      </section>

      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-yellow-400 text-black text-center py-2 font-semibold">
          ⚠️ You are offline. Showing limited tales from offline storage.
        </div>
      )}

      {/* Filters */}
      <section className="p-8 max-w-7xl mx-auto -mt-5 relative z-10">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search stories..."
            className="border p-3 rounded-lg flex-1 focus:ring-2 focus:ring-green-400 shadow"
            value={search}
            onChange={(e) => {
              setTales([]);
              setLimit(12);
              setSearch(e.target.value);
            }}
          />
          <select
            className="border p-3 rounded-lg focus:ring-2 focus:ring-green-400 shadow"
            value={nationFilter}
            onChange={(e) => {
              setTales([]);
              setLimit(12);
              setNationFilter(e.target.value);
            }}
          >
            <option value="">All Nations</option>
            {nations.map((nation) => (
              <option key={nation} value={nation}>
                {nation}
              </option>
            ))}
          </select>
        </div>

        {/* Tales Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        >
          <AnimatePresence>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="border p-4 rounded-lg shadow animate-pulse h-52"></div>
                ))
              : tales.map((tale, index) => (
                  <motion.div
                    key={tale.id}
                    layout
                    variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/90 backdrop-blur-sm border p-5 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition flex flex-col justify-between"
                  >
                    <div>
                      <h2 className="font-semibold text-xl mb-2">{tale.title}</h2>
                      <p className="text-gray-700 line-clamp-4">{tale.text}</p>
                      <p className="mt-2 text-sm text-gray-500">Source: {tale.source}</p>
                      <span className="mt-2 inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        {tale.nation}
                      </span>
                    </div>
                    <button
                      onClick={() => openTale(index)}
                      className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-full text-white font-semibold transition transform hover:scale-105"
                    >
                      View Tale
                    </button>
                  </motion.div>
                ))}
          </AnimatePresence>
        </motion.div>

        {/* Load More */}
        {tales.length >= limit && !loading && !isOffline && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-full text-white font-semibold shadow-lg transition transform hover:scale-105"
            >
              View More
            </button>
          </div>
        )}
      </section>

      {/* Full-screen Tale Modal */}
      <AnimatePresence>
        {selectedTaleIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full h-full bg-white/95 backdrop-blur-md p-6 overflow-y-auto relative rounded-lg shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={closeTale}
                className="absolute top-4 right-4 text-gray-800 hover:text-black font-bold text-3xl"
              >
                ✕
              </button>

              {tales[selectedTaleIndex] && (
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h2 className="text-4xl font-bold mb-6 text-gray-900">{tales[selectedTaleIndex].title}</h2>
                    <p className="text-lg text-gray-800 leading-relaxed mb-6">{tales[selectedTaleIndex].text}</p>
                    <div className="flex justify-between items-center text-gray-700">
                      <span className="bg-green-500 text-white text-sm px-3 py-1 rounded">
                        {tales[selectedTaleIndex].nation}
                      </span>
                      <p className="text-sm">{tales[selectedTaleIndex].source}</p>
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <button
                      onClick={prevTale}
                      disabled={selectedTaleIndex === 0}
                      className="px-6 py-3  bg-blue-500 hover:bg-blue-600  rounded-full text-gray-900 font-semibold disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={nextTale}
                      disabled={selectedTaleIndex === tales.length - 1}
                      className="px-6 py-3  bg-blue-500 hover:bg-blue-600  rounded-full text-gray-900 font-semibold disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />

      {/* Decorative blobs */}
      <div className="absolute top-[-60px] left-[-60px] w-72 h-72 bg-green-400/30 rounded-full filter blur-3xl animate-blob"></div>
      <div className="absolute bottom-[-60px] right-[-40px] w-72 h-72 bg-blue-400/30 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
