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
    const res = await fetch("https://asmussen.app.n8n.cloud/webhook/merchadvise");
    const json = await res.json();
    setVoorstellen(json.data);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-4 text-blue-600">
          Productvoorstel
        </h1>
        <p className="mb-4 text-gray-700">
          Dit voorstel is gebaseerd op de huidige weersomstandigheden, de weersverwachting voor
          de komende drie dagen, besproken producten op social media, trends op social media en
          nieuwsactualiteiten.
        </p>
        <button
          onClick={fetchVoorstel}
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          } transition`}
        >
          {loading ? "Laden..." : "Doe voorstel"}
        </button>

        <div className="mt-6 grid gap-4">
          {voorstellen.map((v) => (
            <div key={v.category} className="border rounded-lg p-4 shadow-sm bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">
                {v.category} <span className="text-sm text-gray-600">(score: {v.score})</span>
              </h2>
              <p className="text-gray-600 italic mt-2">{v.onderbouwing}</p>
              <ul className="mt-2 list-disc list-inside">
                {v.voorbeeldproducten.map((prod) => (
                  <li key={prod} className="text-gray-700">
                    {prod}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}