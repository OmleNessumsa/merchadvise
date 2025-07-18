"use client";
import { useState } from "react";

type Voorstel = {
  category: string;
  score: number;
  onderbouwing: string;
  voorbeeldproducten: string[];
};

export default function Home() {
  const [voorstellen, setVoorstellen] = useState<Voorstel[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVoorstel = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://asmussen.app.n8n.cloud/webhook/merchadvise");
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
        <button
          onClick={fetchVoorstel}
          disabled={loading}
          className="px-4 py-2 rounded text-white transition relative overflow-hidden"
          style={{ backgroundColor: "#FC5628" }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent rounded-full"></span>
              Laden...
            </span>
          ) : (
            "Doe voorstel"
          )}
        </button>

        <div className="mt-6 grid gap-4">
          {voorstellen.map((v) => (
            <div
              key={v.category}
              className="border rounded-lg p-4 shadow-sm"
              style={{ backgroundColor: "#F1E5FE", borderColor: "#C896FA" }}
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
