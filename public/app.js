const btn = document.getElementById("random-btn");
const card = document.getElementById("card");
const img = document.getElementById("card-img");
const title = document.getElementById("card-title");
const fact = document.getElementById("card-fact");
const yearEl = document.getElementById("year");

if (yearEl) yearEl.textContent = new Date().getFullYear();

async function loadAnimal() {
  btn.disabled = true;
  btn.textContent = "Ładowanie…";
  card.classList.remove("hidden");
  card.classList.add("loading");

  try {
    const res = await fetch("/api/animal", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();

    img.src = data.image;
    img.alt = data.label;
    title.textContent = `${data.label} ${data.type === "cat" ? "🐱" : "🐶"}`;
    fact.textContent = data.fact;
  } catch (err) {
    title.textContent = "Ups! 🙈";
    fact.textContent = "Nie udało się pobrać zwierzaka. Spróbuj ponownie.";
  } finally {
    btn.disabled = false;
    btn.textContent = "Pokaż losowe zwierzątko 🎲";
    card.classList.remove("loading");
  }
}

btn.addEventListener("click", loadAnimal);
loadAnimal();
