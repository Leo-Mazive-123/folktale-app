"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface Tale {
  id: number;
  title: string;
  text: string;
  nation: string;
  source: string;
}

export default function HomePage() {
  const [tales, setTales] = useState<Tale[]>([]);
  const [search, setSearch] = useState("");
  const [nationFilter, setNationFilter] = useState("");
  const [limit, setLimit] = useState(6);
  const [nations, setNations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTaleIndex, setSelectedTaleIndex] = useState<number | null>(null);
  const [isOffline, setIsOffline] = useState(false); // safe initial value

  const firstNewTaleRef = useRef<HTMLDivElement | null>(null);
  const taleContentRef = useRef<HTMLDivElement | null>(null);

  // Fetch offline tales from public folder
  const fetchOfflineTales = useCallback(async () => {
    const res = await fetch("/data/offlineTales.json");
    const data: Tale[] = await res.json();
    return data;
  }, []);

  const fetchTales = useCallback(async () => {
    setLoading(true);

    let data: Tale[] = [];
    if (isOffline) {
      data = await fetchOfflineTales();
    } else {
      let query = supabase.from("tales").select("*").limit(limit);
      if (search) query = query.ilike("title", `%${search}%`);
      if (nationFilter) query = query.eq("nation", nationFilter);

      const { data: onlineData } = await query;
      if (onlineData) data = onlineData as Tale[];
    }

    // Apply filtering locally for offline mode
    if (isOffline) {
      if (search) {
        data = data.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));
      }
      if (nationFilter) {
        data = data.filter((t) => t.nation === nationFilter);
      }
      data = data.slice(0, limit);
    }

    setTales(data);
    setLoading(false);
  }, [search, nationFilter, limit, fetchOfflineTales, isOffline]);

  const fetchNations = useCallback(async () => {
    let data: Tale[] = [];
    if (isOffline) {
      data = await fetchOfflineTales();
      const uniqueNations = Array.from(new Set(data.map((t) => t.nation)));
      setNations(uniqueNations);
      return;
    }
    const { data: onlineData } = await supabase.from("tales").select("nation");
    if (onlineData) {
      const nationsArray = (onlineData as { nation: string }[]).map((item) => item.nation);
      setNations(Array.from(new Set(nationsArray)));
    }
  }, [fetchOfflineTales, isOffline]);

  const loadMore = () => {
    setLimit((prev) => prev + 6);
    setTimeout(() => {
      firstNewTaleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  };

  const openTale = (index: number) => setSelectedTaleIndex(index);
  const closeTale = () => setSelectedTaleIndex(null);
  const prevTale = () => {
    if (selectedTaleIndex !== null && selectedTaleIndex > 0) {
      setSelectedTaleIndex(selectedTaleIndex - 1);
      taleContentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const nextTale = () => {
    if (selectedTaleIndex !== null && selectedTaleIndex < tales.length - 1) {
      setSelectedTaleIndex(selectedTaleIndex + 1);
      taleContentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Update tales when filters change without clearing current view
  useEffect(() => {
    fetchTales();
  }, [search, nationFilter, limit, fetchTales]);

  // Initial load and offline/online detection
  useEffect(() => {
    // Set initial offline status safely on client
    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    fetchTales();
    fetchNations();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [fetchTales, fetchNations]);

  return (
    <motion.div
      className="min-h-screen bg-gray-50 transition-colors duration-500"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero Section */}
      <section
        className="relative h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/homee.png')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <motion.div
          className="relative text-center text-white px-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Welcome to Folktales App</h1>
          <p className="text-lg md:text-2xl mb-6 max-w-2xl mx-auto">
            Explore amazing folktales from all around the world. Stay updated with the latest stories we add every week!
          </p>
          <button
            onClick={() => openTale(Math.floor(Math.random() * tales.length))}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-full text-white font-semibold transition transform hover:scale-105"
          >
            Read a Random Tale
          </button>
        </motion.div>
      </section>

      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-yellow-400 text-black text-center py-2 font-semibold">
          ⚠️ You are offline. Showing limited tales from offline storage.
        </div>
      )}

      {/* Search & Nation Filter */}
      <section className="p-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search stories..."
            className="border p-2 rounded flex-1 focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
            value={nationFilter}
            onChange={(e) => setNationFilter(e.target.value)}
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
          layout
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        >
          <AnimatePresence>
            {loading && tales.length === 0
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="border p-4 rounded shadow animate-pulse h-48"></div>
                ))
              : tales.map((tale, index) => (
                  <motion.div
                    key={tale.id}
                    ref={index === limit - 6 ? firstNewTaleRef : null}
                    layout
                    variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="border p-4 rounded shadow hover:shadow-lg hover:scale-105 transition bg-white flex flex-col justify-between"
                  >
                    <div>
                      <h2 className="font-semibold text-xl mb-2">{tale.title}</h2>
                      <p className="text-gray-700 line-clamp-4">{tale.text}</p>
                      <p className="mt-2 text-sm text-gray-500">Source: {tale.source}</p>
                      <span className="mt-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">{tale.nation}</span>
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

        {/* View More Button */}
        {tales.length >= limit && !loading && !isOffline && (
          <div className="flex justify-center mt-6">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-full text-white font-semibold shadow-lg transition transform hover:scale-105"
            >
              View More
            </button>
          </div>
        )}
      </section>

      {/* Full-Screen Tale Panel */}
      <AnimatePresence>
        {selectedTaleIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full h-full bg-white p-8 overflow-y-auto relative rounded-xl shadow-xl"
              ref={taleContentRef}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={closeTale}
                className="absolute top-4 right-6 text-gray-800 hover:text-black font-bold text-3xl z-50"
              >
                ✕
              </button>

              {tales[selectedTaleIndex] && (
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h2 className="text-4xl font-bold mb-6 text-gray-900">
                      {tales[selectedTaleIndex].title}
                    </h2>
                    <p className="text-lg text-gray-800 leading-relaxed mb-6">
                      {tales[selectedTaleIndex].text}
                    </p>
                    <div className="flex justify-between items-center text-gray-700">
                      <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded">
                        {tales[selectedTaleIndex].nation}
                      </span>
                      <p className="text-sm">{tales[selectedTaleIndex].source}</p>
                    </div>
                  </div>
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={prevTale}
                      disabled={selectedTaleIndex === 0}
                      className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-full text-white font-semibold disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={nextTale}
                      disabled={selectedTaleIndex === tales.length - 1}
                      className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-full text-white font-semibold disabled:opacity-50"
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
      <Navbar />
    </motion.div>
  );
}
