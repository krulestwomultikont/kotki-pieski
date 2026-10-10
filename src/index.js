/**
 * Cloudflare Worker dla strony "Kotki i Pieski".
 * - /api/animal  -> losowy kotek lub piesek (ciekawostka + zdjęcie z publicznego API)
 * - wszystko inne -> statyczne pliki z ./public (binding ASSETS)
 */

const CAT_FACTS = [
  "Koty potrafią wydać ponad 100 różnych dźwięków, podczas gdy psy tylko około 10.",
  "Koci nos jest unikalny jak ludzki odcisk palca — nie ma dwóch takich samych.",
  "Koty spędzają nawet 70% życia śpiąc. To około 13–16 godzin na dobę!",
  "Mruczenie kota może pomagać w regeneracji kości i łagodzić stres.",
  "Koty mają 32 mięśnie w każdym uchu i mogą obracać je niezależnie.",
  "Kot nie czuje słodkiego smaku — brakuje mu receptora odpowiedzialnego za cukier.",
  "Kocia wąsy to czułe narządy, które pomagają orientować się w ciemności.",
  "Koty chodzą, stawiając najpierw przednie i tylne łapy po tej samej stronie ciała.",
  "Najszybszy kot domowy osiąga prędkość nawet 48 km/h.",
  "Koty pocą się głównie przez łapki, nie przez skórę.",
];

const DOG_FACTS = [
  "Psy mają węch nawet 40 razy czulszy od ludzkiego.",
  "Odcisk nosa psa jest unikalny — jak ludzki odcisk palca.",
  "Psy potrafią rozpoznać nawet 250 słów i gestów.",
  "Szczenięta rodzą się głuche i ślepe, otwierają oczy po około 2 tygodniach.",
  "Psy śnią — podczas snu mogą przebierać łapami i skomleć.",
  "Greyhound to najszybszy pies, potrafi biec do 70 km/h.",
  "Serce psa bije szybciej niż człowieka — od 60 do 140 uderzeń na minutę.",
  "Psy mają trzy powieki, w tym jedną ukrytą w kąciku oka.",
  "Owczarek niemiecki ma około 225 milionów komórek węchowych, człowiek tylko 5 milionów.",
  "Psy pocą się głównie przez łapy i regulują temperaturę przez ziajanie.",
];

function randomOf(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function fetchJson(url, timeoutMs = 3500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "kotki-pieski-worker" },
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function imageFor(type) {
  const fallback =
    type === "cat"
      ? "https://cataas.com/cat?width=640&height=480"
      : "https://placedog.net/640/480";

  try {
    if (type === "cat") {
      const data = await fetchJson("https://api.thecatapi.com/v1/images/search");
      return data?.[0]?.url || fallback;
    }
    const data = await fetchJson("https://dog.ceo/api/breeds/image/random");
    return data?.message || fallback;
  } catch {
    return fallback;
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/animal") {
      const type = Math.random() < 0.5 ? "cat" : "dog";
      const [image] = await Promise.all([imageFor(type)]);
      const fact = randomOf(type === "cat" ? CAT_FACTS : DOG_FACTS);

      return Response.json(
        {
          type,
          label: type === "cat" ? "Kotek" : "Piesek",
          fact,
          image,
        },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    return env.ASSETS.fetch(request);
  },
};
