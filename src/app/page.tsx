"use client";
import { useState } from "react";

type Voorstel = {
  category: string;
  score: number;
  onderbouwing: string;
  voorbeeldproducten: string[];
};

const webhooks = {
  voorstel: {
    url: "https://asmussen.app.n8n.cloud/webhook/merchadvise",
    colors: { bg: "#F1E5FE", border: "#C896FA" },
  },
  weer: {
    url: "https://asmussen.app.n8n.cloud/webhook/merch_weer",
    colors: { bg: "#EFFAE0", border: "#DFF6C0" },
  },
  social: {
    url: "https://asmussen.app.n8n.cloud/webhook/merch-social",
    colors: { bg: "#E4F3F3", border: "#B6E0E0" },
  },
  products: {
    url: "https://asmussen.app.n8n.cloud/webhook/products",
    colors: { bg: "#E2F3FF", border: "#6EA9E5" },
  },
};

export default function Home() {
  const [voorstellen, setVoorstellen] = useState<Voorstel[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentColors, setCurrentColors] = useState(webhooks.voorstel.colors);

  const fetchVoorstel = async (type: keyof typeof webhooks) => {
    setLoading(true);
    setCurrentColors(webhooks[type].colors);
    try {
      const res = await fetch(webhooks[type].url);
      const json = await res.json();
      const parsed = JSON.parse(json.output);

      if (parsed && Array.isArray(parsed.data)) {
        setVoorstellen(parsed.data);
      } else {
        console.error("Ongeldige data ontvangen:", parsed);
        setVoorstellen([]);
      }
    } catch (error) {
      console.error("Fetch-fout:", error);
      setVoorstellen([]);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen p-10" style={{ backgroundColor: "#E5F6FF" }}>
      <div className="max-w-4xl mx-auto shadow-xl rounded-xl p-6 bg-white">
        <h1 className="text-3xl font-bold mb-4" style={{ color: "#FC5628" }}>
          Productvoorstel
        </h1>
        <p className="mb-4" style={{ color: "#1E0033" }}>
          Dit voorstel is gebaseerd op de huidige weersomstandigheden, de weersverwachting voor
          de komende drie dagen, besproken producten op social media, trends op social media en
          nieuwsactualiteiten.
        </p>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => fetchVoorstel("voorstel")}
            disabled={loading}
            className="px-4 py-2 rounded text-white transition"
            style={{ backgroundColor: "#FC5628" }}
          >
            Voorstel
          </button>
          <button
            onClick={() => fetchVoorstel("weer")}
            disabled={loading}
            className="px-4 py-2 rounded text-white transition"
            style={{ backgroundColor: "#1E0033" }}
          >
            Weer
          </button>
          <button
            onClick={() => fetchVoorstel("social")}
            disabled={loading}
            className="px-4 py-2 rounded text-white transition"
            style={{ backgroundColor: "#1E0033" }}
          >
            Social
          </button>
          <button
            onClick={() => fetchVoorstel("products")}
            disabled={loading}
            className="px-4 py-2 rounded text-white transition"
            style={{ backgroundColor: "#1E0033" }}
          >
            Products
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          {voorstellen.map((v) => (
            <div
              key={v.category}
              className="border rounded-lg p-4 shadow-sm"
              style={{ backgroundColor: currentColors.bg, borderColor: currentColors.border }}
            >
              <h2 className="text-xl font-semibold" style={{ color: "#FC5628" }}>
                {v.category} <span className="text-sm" style={{ color: "#1E0033" }}>(score: {v.score})</span>
              </h2>
              <p className="italic mt-2" style={{ color: "#1E0033" }}>
                {v.onderbouwing}
              </p>
              <ul className="mt-2 list-disc list-inside" style={{ color: "#1E0033" }}>
                {v.voorbeeldproducten.map((prod) => (
                  <li key={prod}>{prod}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
