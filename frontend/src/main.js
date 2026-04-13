import "./style.css";

const btn = document.getElementById("sendBtn");
const audioInput = document.getElementById("audioInput");
const langSelect = document.getElementById("lang");
const audioPlayer = document.getElementById("audioPlayer");
const loading = document.getElementById("loading");

btn.addEventListener("click", async () => {
  const file = audioInput.files[0];
  const lang = langSelect.value;

  // Validación
  if (!file) {
    alert("Selecciona un audio primero");
    return;
  }

  // Estado de carga
  loading.style.display = "block";
  btn.disabled = true;
  btn.textContent = "Procesando...";

  try {
    const formData = new FormData();
    formData.append("audio", file);
    formData.append("lang", lang);

    const res = await fetch("http://localhost:3000/api/full-flow", {
      method: "POST",
      body: formData
    });

    if (!res.ok) {
      throw new Error("Error en la API");
    }

    const blob = await res.blob();
    const audioUrl = URL.createObjectURL(blob);

    audioPlayer.src = audioUrl;
    audioPlayer.play();

  } catch (error) {
    console.error(error);
    alert("Hubo un error al procesar el audio");
  }

  // Restaurar estado
  loading.style.display = "none";
  btn.disabled = false;
  btn.textContent = "Traducir";
});
