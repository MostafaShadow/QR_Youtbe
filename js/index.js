const card = document.querySelector(".card"),
  form = card.querySelector("form"),
  inputFile = form.querySelector("input"),
  image = card.querySelector("img"),
  textarea = card.querySelector("textarea"),
  close = document.querySelector(".close"),
  copy = document.querySelector(".copy"),
  qr_text = card.querySelector(".qr_text"),
  success = new Audio("../assets/audios/succ.mp3"),
  faild = new Audio("../assets/audios/faild.mp3");

// handle close card

close.addEventListener("click", () => {
  card.classList.remove("active");
});
// handle copy
copy.addEventListener("click", () => {
  let text = textarea.textContent;
  navigator.clipboard.writeText(text);
});
// handle change events
inputFile.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  let formData = new FormData();
  formData.append("file", file);
  fetchData(file, formData);
});
// handle click
form.addEventListener("click", () => inputFile.click());

// fetchData
async function fetchData(file, formData) {
  qr_text.innerText = "...أستنا لما نشوف أخرتها";
  try {
    const res = await fetch("http://api.qrserver.com/v1/read-qr-code/", {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    const data = result[0].symbol[0].data;
    qr_text.innerText = data
      ? " 🤔 !اضغط هنا ياعم وخلينا نشوف"
      : " 😡  أنت بتشتغلني ؟";
    if (!data) {
      return faild.play();
    }
    textarea.innerText = data;
    image.src = URL.createObjectURL(file);
    card.classList.add("active");
    return success.play();
  } catch (err) {
    console.log(err);
  }
}
