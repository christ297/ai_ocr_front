import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Moon, UploadCloud, Loader2 } from "lucide-react";

export default function App() {
  const baseUrl = "http://127.0.0.1:8000";
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
    setError("");
    setResult(null);
  };

  const handleUpload = async () => {
    if (!image) {
      setError("Veuillez sélectionner une image.");
      return;
    }

    setLoading(true);
    setError("");
    setProgress(10);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post(`${baseUrl}/api/ocr/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        },
      });

      setResult(response.data);
      setProgress(100);
    } catch (err) {
      setError("Erreur lors du traitement de l'image.");
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} min-h-screen flex flex-col items-center justify-center p-6 transition-all`}>
      {/* Toggle Dark Mode */}
      <button
        className="absolute top-4 right-4 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition"
        onClick={() => setDarkMode(!darkMode)}
      >
        <Moon size={24} />
      </button>

      {/* Titre */}
      <h1 className="text-4xl font-bold mb-6 text-center">OCR avec Intelligence Artificielle</h1>

      {/* Upload Box */}
      <label className="cursor-pointer w-96 h-48 border-2 border-dashed border-gray-500 flex flex-col items-center justify-center p-6 rounded-lg hover:border-blue-500 transition bg-opacity-10 backdrop-blur-lg">
        <UploadCloud size={48} className="text-gray-400 mb-3" />
        <span className="text-lg">{image ? image.name : "Cliquez ou déposez une image ici"}</span>
        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
      </label>

      {/* Bouton envoyer */}
      <button
        onClick={handleUpload}
        className={`mt-5 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-lg ${loading && "cursor-not-allowed opacity-75"}`}
        disabled={loading}
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : null}
        {loading ? "Analyse en cours..." : "Analyser l'image"}
      </button>

      {/* Barre de progression */}
      {loading && (
        <div className="mt-4 w-96 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-2 bg-blue-500"
          ></motion.div>
        </div>
      )}

      {/* Affichage des erreurs */}
      {error && <p className="text-red-400 mt-4">{error}</p>}

      {/* Affichage des résultats */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 w-full max-w-lg bg-gray-800 text-white p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-3">Texte extrait :</h2>
          <p className="text-lg">{result.texte_corrige}</p>
        </motion.div>
      )}
    </div>
  );
}

// Loader animé
const SkeletonLoader = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-6 w-40 bg-gray-700 rounded"></div>
    <div className="h-4 w-32 bg-gray-600 rounded"></div>
  </div>
);
