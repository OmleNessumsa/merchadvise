"use client";
import { useState } from "react";

// Types
interface Deal {
  image_url: string;
  text: string;
  link: string;
}

interface Campaign {
  title: string;
  promotekst: string;
  deals: Deal[];
}

interface SmartCard {
  category: string;
  score: number;
  onderbouwing: string;
  voorbeeldproducten: string[];
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [smartcards, setSmartcards] = useState<SmartCard[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitPrompt = async (query: string) => {
    setLoading("prompt");
    setError(null);
    setCampaign(null);
    setSmartcards(null);
    try {
      const res = await fetch(
        `https://asmussen.app.n8n.cloud/webhook/merch_prompt?prompt=${encodeURIComponent(query)}`
      );
      const json = await res.json();
      const parsed = JSON.parse(json.output);
      if (parsed.campaigns?.[0]) {
        setCampaign(parsed.campaigns[0]);
      } else {
        setError("Geen campagnes gevonden.");
      }
    } catch (e) {
      setError("Fout bij ophalen prompt-campagne.");
    }
    setLoading(null);
  };

  const fetchSmart = async (type: "smart" | "weer") => {
    setLoading(type);
    setError(null);
    setCampaign(null);
    setSmartcards(null);
    const url =
      type === "smart"
        ? "https://asmussen.app.n8n.cloud/webhook/merchadvise"
        : "https://asmussen.app.n8n.cloud/webhook/merch_weer";
    try {
      const res = await fetch(url);
      const json = await res.json();
      const parsed = JSON.parse(json.output);
      setSmartcards(parsed.data);
    } catch (e) {
      setError("Fout bij ophalen suggesties.");
    }
    setLoading(null);
  };

  const handleCardClick = (card: SmartCard) => {
    const content = `${card.category}: ${card.onderbouwing} Suggesties: ${card.voorbeeldproducten.join(", ")}`;
    submitPrompt(content);
  };

  return (
    <main className="min-h-screen bg-[#edf4fb] p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Merchy</h1>

        <div className="flex gap-2 items-center mb-4">
          <input
            type="text"
            placeholder="Ik wil graag een campagne met beauty producten"
            className="flex-1 p-3 rounded border border-gray-300 shadow"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitPrompt(prompt)}
          />
          <button
            onClick={() => submitPrompt(prompt)}
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded"
          >
            ✈️
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => fetchSmart("smart")}
            disabled={loading !== null}
            className="bg-[#1E0033] text-white px-4 py-2 rounded"
          >
            {loading === "smart" ? "Laden..." : "Smart Suggest"}
          </button>
          <button
            onClick={() => fetchSmart("weer")}
            disabled={loading !== null}
            className="bg-[#1E0033] text-white px-4 py-2 rounded"
          >
            {loading === "weer" ? "Laden..." : "Weer"}
          </button>
        </div>

        {loading === "prompt" && (
          <p className="text-blue-600 mb-4 animate-pulse">
            Dit kan 5 tot 10 minuten duren afhankelijk van de hoeveelheid deals...
          </p>
        )}

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {campaign && (
          <div className="mt-6">
            <h2 className="text-3xl font-bold mb-2">{campaign.title}</h2>
            <p className="mb-6 text-lg">{campaign.promotekst}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {campaign.deals.map((deal, index) => (
                <a
                  key={index}
                  href={deal.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-lg shadow p-4 flex gap-4 items-center hover:bg-gray-50 transition"
                >
                  <img src={deal.image_url} alt="" className="w-20 h-20 object-contain" />
                  <p className="text-sm font-medium">{deal.text}</p>
                </a>
              ))}
            </div>
          </div>
        )}

        {smartcards && (
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {smartcards.map((card) => (
              <div
                key={card.category}
                className="bg-white rounded-xl border border-gray-200 shadow p-6 cursor-pointer hover:shadow-md transition"
                onClick={() => handleCardClick(card)}
              >
                <h3 className="text-xl font-semibold mb-2 text-[#FC5628]">
                  {card.category} <span className="text-sm text-[#1E0033]">({card.score})</span>
                </h3>
                <p className="italic text-[#1E0033] mb-2">{card.onderbouwing}</p>
                <ul className="list-disc list-inside text-[#1E0033]">
                  {card.voorbeeldproducten.map((prod) => (
                    <li key={prod}>{prod}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
