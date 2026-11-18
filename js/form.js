// =========================================================
// form.js — Modul 3: validasi formulir & pesan WhatsApp
// =========================================================

const form = document.querySelector("#form-pesan");
const hasilPesan = document.querySelector("#hasil-pesan");
const ringkasan = document.querySelector("#ringkasan");
const tautanWa = document.querySelector("#tautan-wa");

// Nomor WhatsApp toko (FIKTIF, hanya untuk latihan)
const NOMOR_TOKO = "6281234567890";

// 1. Aturan validasi: fungsi pemeriksa + pesan kesalahan untuk tiap kolom
const aturan = {
  nama: {
    cek: (nilai) => nilai.trim().length >= 3,
    pesan: "Nama wajib diisi, minimal 3 huruf.",
  },
  wa: {
    cek: (nilai) => /^08\d{8,11}$/.test(nilai.trim()),
    pesan: "Nomor WhatsApp diawali 08 dan terdiri atas 10–13 digit angka.",
  },
  email: {
    // email boleh kosong; jika diisi, formatnya harus benar
    cek: (nilai) =>
      nilai.trim() === "" ||
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nilai.trim()),
    pesan: "Format surel belum benar, contoh: nama@domain.com.",
  },
  produk: {
    cek: (nilai) => nilai !== "",
    pesan: "Silakan pilih produk.",
  },
  jumlah: {
    cek: (nilai) =>
      Number.isInteger(Number(nilai)) &&
      Number(nilai) >= 1 &&
      Number(nilai) <= 50,
    pesan: "Jumlah harus bilangan bulat 1 sampai 50.",
  },
};

// 2. Menampilkan (atau menghapus) pesan kesalahan sebuah kolom
function tampilkanError(input, pesan) {
  const wadahError = document.querySelector(`#error-${input.id}`);
  wadahError.textContent = pesan;
  input.setAttribute("aria-invalid", pesan !== "" ? "true" : "false");
}

// 3. Memeriksa satu kolom; hasilnya true (valid) atau false
function validasiKolom(input) {
  if (input.type === "checkbox") {
    const dicentang = input.checked;
    tampilkanError(
      input,
      dicentang ? "" : "Centang persetujuan terlebih dahulu."
    );
    return dicentang;
  }

  const aturanKolom = aturan[input.name];
  const valid = aturanKolom.cek(input.value);
  tampilkanError(input, valid ? "" : aturanKolom.pesan);
  return valid;
}

// 4. Daftar kolom yang perlu diperiksa
const kolomDiperiksa = ["nama", "wa", "email", "produk", "jumlah", "setuju"].map(
  (nama) => form.elements[nama]
);

// 5. Kolom yang sudah ditandai salah diperiksa ulang setiap kali isinya berubah,
// sehingga pesan kesalahan langsung hilang begitu pengguna memperbaikinya
kolomDiperiksa.forEach((input) => {
  input.addEventListener("input", () => {
    if (input.getAttribute("aria-invalid") === "true") {
      validasiKolom(input);
    }
  });
});

// 6. Periksa semua kolom ketika formulir dikirim
form.addEventListener("submit", (event) => {
  event.preventDefault(); // cegah halaman dimuat ulang

  let kolomSalahPertama = null;
  kolomDiperiksa.forEach((input) => {
    const valid = validasiKolom(input);
    if (!valid && kolomSalahPertama === null) {
      kolomSalahPertama = input;
    }
  });

  if (kolomSalahPertama !== null) {
    hasilPesan.hidden = true;
    kolomSalahPertama.focus(); // arahkan pengguna ke kesalahan pertama
    return;
  }

  // 7. Semua valid: susun pesan WhatsApp dari data formulir
  const data = new FormData(form);
  const pesan = [
    "Assalamu'alaikum, saya ingin memesan:",
    `Nama: ${data.get("nama").trim()}`,
    `Produk: ${data.get("produk")}`,
    `Jumlah: ${data.get("jumlah")}`,
    `Pengambilan: ${data.get("pengambilan")}`,
    `Catatan: ${data.get("catatan").trim() || "-"}`,
  ].join("\n");

  ringkasan.textContent = pesan; // textContent aman dari XSS
  tautanWa.href = `https://wa.me/${NOMOR_TOKO}?text=${encodeURIComponent(pesan)}`;
  hasilPesan.hidden = false;
  hasilPesan.scrollIntoView({ behavior: "smooth" });
});

